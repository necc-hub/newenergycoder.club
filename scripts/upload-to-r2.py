#!/usr/bin/env python3
"""Upload large image assets to Cloudflare R2.

Credentials are read from environment variables (or a local .env file):
    R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET

Usage:
    python scripts/upload-to-r2.py gallery        # dist-gallery-thumbnails/images/gallery-thumbnails
    python scripts/upload-to-r2.py members        # src/image
    python scripts/upload-to-r2.py all            # both
    python scripts/upload-to-r2.py members --force   # re-upload even if key exists (overwrite)
"""
import os
import sys
import mimetypes
from pathlib import Path

import boto3
from botocore.config import Config


def load_dotenv(env_path: Path):
    """Minimal .env loader (no external dependency)."""
    if not env_path.is_file():
        return
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        key, val = key.strip(), val.strip().strip('"').strip("'")
        os.environ.setdefault(key, val)


load_dotenv(Path(__file__).resolve().parent.parent / ".env")

R2_ENDPOINT = os.environ.get("R2_ENDPOINT", "")
R2_ACCESS_KEY_ID = os.environ.get("R2_ACCESS_KEY_ID", "")
R2_SECRET_ACCESS_KEY = os.environ.get("R2_SECRET_ACCESS_KEY", "")
R2_BUCKET = os.environ.get("R2_BUCKET", "docs")

if not all([R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY]):
    sys.exit(
        "Missing R2 credentials. Set R2_ENDPOINT / R2_ACCESS_KEY_ID / "
        "R2_SECRET_ACCESS_KEY in the environment or a local .env file."
    )

IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"}

s3 = boto3.client(
    "s3",
    endpoint_url=R2_ENDPOINT,
    aws_access_key_id=R2_ACCESS_KEY_ID,
    aws_secret_access_key=R2_SECRET_ACCESS_KEY,
    region_name="auto",
    config=Config(signature_version="s3v4"),
)


def collect_files(local_dir: Path):
    for p in local_dir.rglob("*"):
        if p.is_file() and p.suffix.lower() in IMAGE_EXTS:
            yield p


def list_existing(prefix: str):
    keys = set()
    resp = s3.list_objects_v2(Bucket=R2_BUCKET, Prefix=prefix)
    keys.update(obj["Key"] for obj in resp.get("Contents", []))
    while resp.get("IsTruncated"):
        resp = s3.list_objects_v2(
            Bucket=R2_BUCKET,
            Prefix=prefix,
            ContinuationToken=resp["NextContinuationToken"],
        )
        keys.update(obj["Key"] for obj in resp.get("Contents", []))
    return keys


def upload(local_dir: Path, r2_prefix: str, force: bool = False):
    existing = set() if force else list_existing(r2_prefix)
    uploaded = 0
    skipped = 0
    total_bytes = 0

    for p in collect_files(local_dir):
        rel = p.relative_to(local_dir).as_posix()
        key = f"{r2_prefix}{rel}"

        if not force and key in existing:
            print(f"[skip] {key}")
            skipped += 1
            continue

        content_type, _ = mimetypes.guess_type(str(p))
        if not content_type:
            content_type = "application/octet-stream"

        size_mb = p.stat().st_size / 1024 / 1024
        print(f"[upload] {key} ({size_mb:.2f} MB)")
        s3.upload_file(str(p), R2_BUCKET, key, ExtraArgs={"ContentType": content_type})
        uploaded += 1
        total_bytes += p.stat().st_size

    print(
        f"\nDone: uploaded {uploaded}, skipped {skipped}, "
        f"total {(total_bytes / 1024 / 1024):.2f} MB"
    )


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    force = "--force" in sys.argv
    target = args[0] if args else "all"
    root = Path(__file__).resolve().parent.parent

    if target in ("gallery", "all"):
        gallery_dir = root / "dist-gallery-thumbnails" / "images" / "gallery-thumbnails"
        print("Uploading gallery thumbnails...")
        upload(gallery_dir, "images/gallery-thumbnails/", force)

    if target in ("members", "all"):
        members_dir = root / "src" / "image"
        print("\nUploading member photos...")
        upload(members_dir, "images/src/image/", force)


if __name__ == "__main__":
    main()
