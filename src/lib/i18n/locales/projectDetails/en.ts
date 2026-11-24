import type { ProjectDetailCopy } from './zh'

/** English project copy, mirroring the Chinese source of truth. */
export const projectDetailsEn: Record<string, ProjectDetailCopy> = {
  '9': {
    tagline: 'A PV & storage design console, from rooftop survey to investment report',
    summary:
      'A local-first web app for commercial & industrial PV and park energy projects: array layout, 8760-hour simulation, IRR/NPV analysis, self-consumption and storage sizing in one workflow.',
    overview:
      'SolarGlyph grew out of the NEC community repo into its own product line. It replaces scattered spreadsheets with a single pipeline: project setup → map-based site selection and array layout → hourly generation simulation → cash flow / IRR / payback → report export. The online version can be tried without registration.',
    shared: [
      'React 18 + TypeScript + Vite 6 SPA with Three.js 2D/3D array preview',
      'DXF/DWG drawing preview, KML/KMZ/SHP import and in-browser geometry parsing',
      'Investment analysis: IRR, NPV, payback, LCOE, sensitivity analysis, electric/thermal storage',
      'EMC intake portal with 21 one-click red-line checks, project workflow system, mini-program',
      'Cloudflare Worker backends: Feishu sync, KYB company verification, M&A quoting, ERP Q&A',
    ],
    audience: 'Anyone interested in PV/storage business logic, 3D web visualisation, numerical simulation or financial modelling.',
    contribute:
      'Try the online version and file issues; code-side we welcome tests, simulation model improvements and translations (the repo already ships six languages).',
    statusNote: 'Independent flagship repository, actively developed and usable online.',
  },
  '10': {
    tagline: 'One-item-one-code warehouse operations for the A416 lab',
    summary:
      'A single-file web MES for our lab: unique item tracking, scan-based in/out, stocktaking work orders and label printing — offline-capable, with two-way sync to Feishu Base.',
    overview:
      '416MES solves a real lab problem: borrowed equipment that never comes back and stock kept in people’s heads. The system centres on unique items (ITM), with locations (LOC), containers (CTN) and work orders (WIP) forming a closed loop. The home page is a mobile-first scan workbench for on-site use.',
    shared: [
      'Single-file front end with IndexedDB persistence: keep working offline, sync when reconnected',
      'Full loop: registration → label printing (HPRT N41) → receive → issue → relocate → stocktake → work orders',
      'Immutable audit log and inventory ledger: who moved which item, when',
      'Feishu Base cloud backend (9 tables) with full/incremental sync, three-way merge, offline outbox',
      'Vercel serverless APIs, item/container short links, Excel import/export templates',
    ],
    audience: 'Developers curious about real business systems, offline-first architecture, scanning UX or the Feishu open platform.',
    contribute:
      'Good entry points are UI details, scanning experience and sync conflict handling. CURRENT_STATUS.md and ITM_SCHEMA.md document the current architecture so newcomers avoid legacy pitfalls.',
    statusNote: 'In daily use at the A416 lab; v3.13 under active maintenance.',
  },
  '11': {
    tagline: 'Team collaboration, app hosting and agent access in one Worker',
    summary:
      'NEC’s own portal and middle platform: Feishu login, tasks, reimbursement, drawing review, an app gallery and a Skill centre — plus a public MCP endpoint for AI agents.',
    overview:
      'nec-hub is a single Cloudflare Worker combining day-to-day collaboration (tasks, approvals, reimbursement, weekly reports) with outward-facing capabilities (R2 app hosting, KV registry, D1 ERP snapshots). It is also NEC’s agent entry point: desktop IDEs can attach to its MCP endpoint in one step.',
    shared: [
      'A 15-tab portal: my tasks, drawing review, reimbursement, season goals, app gallery, Skill centre, dashboards',
      'MCP endpoint (streamable HTTP / JSON-RPC) so AI assistants can read and write team tasks and resources',
      'Feishu OAuth sessions, an approval engine (state machine + SLA patrol), automated weekly report cron',
      'Repository aggregation API merging GitHub + Gitee with KV caching',
      'Domain dispatch, R2 app hosting and other infrastructure code',
    ],
    audience: 'Anyone into serverless architecture, the Feishu open platform, the MCP protocol or building collaboration tools.',
    contribute:
      'The code is split by domain (src/auth, src/erp, src/approvals…); adding a portal tab or an MCP tool is a good first contribution.',
    statusNote: 'Live in production, powering the team’s daily collaboration.',
  },
  '1': {
    tagline: 'Fluid equipment monitoring with Raspberry Pi 5 + Modbus',
    summary:
      'A real, physically built industrial monitoring project: a Raspberry Pi 5 host, Modbus RTU/RS485 sensors and actuators, and a Python + Qt visualisation interface.',
    overview:
      'The 5-axis fluid workstation combines industrial automation, data acquisition and AI analysis: real-time multi-sensor acquisition, a Qt HMI, remote web monitoring and exploratory fault prediction. The project has explicit roles (hardware, algorithms, front end, BSP), making it a complete embedded + host-computer learning case.',
    shared: [
      'Hardware design: Raspberry Pi 5, photoelectric limit switches, temperature/flow sensors, stepper/servo motors, solenoid valves',
      'Modbus RTU/ASCII over RS485 implementation with real wiring photos',
      'Python stack: PyModbus, PyQt/QML, NumPy/Pandas, Qt Charts',
      'Conda environment (environment.yml) and cross-platform requirements for reproducibility',
      'Project docs and team-role records to follow when building your own acquisition system',
    ],
    audience: 'Students wanting hands-on experience with embedded hosts, industrial protocols, sensor acquisition or Qt interfaces.',
    contribute:
      'Start with a single sensor, Modbus register debugging or HMI polish; the physical rig lives in the A416 lab.',
    statusNote: 'Started March 2025; the dedicated main repository is under active development.',
  },
  '12': {
    tagline: 'Full-season robot competition assets, from zero to one',
    summary:
      'NEC’s flagship competition track. Mechanical drawings, electronics code, vision pipelines and operations material from the 2024–2026 seasons, all open, organised into mechanism / vision / operations SIGs.',
    overview:
      'ROBOCON is where NEC invests most deeply. Each season gets its own engineering directory: STEP drawings of chassis and launcher mechanisms, STM32 motor driver projects, vision solutions and operations material. Newcomers can trace a team’s complete journey from zero to a working robot.',
    shared: [
      '2026 season: mechanism (mechanical + electronics), vision and operations SIGs, incl. an M3508 STM32H7 driver project',
      '2025 season: mechanical STEP drawings, pneumatic selection and control principles, Unitree M8010 drivers, electronics code',
      '2024 season: electronics code, budget sheets and early-stage material',
      'Supply-chain assets: 82 sets of FRC reference drawings, standardised aluminium extrusion library',
      'Season repo templates and documentation standards (see the docs site templates)',
    ],
    audience: 'Students aiming at ROBOCON / RoboMaster / smart-car competitions — mechanical, electronics, vision and operations roles all open.',
    contribute:
      'Join a SIG: mechanical does structure and fabrication, electronics does drivers and integration, vision does detection and localisation, operations handles submissions and outreach.',
    statusNote: 'Runs on a seasonal cadence; the 2026 season is in progress.',
  },
  '2': {
    tagline: 'A NearLink wireless controller built on the WS63 module',
    summary:
      'A physical gamepad using the new NearLink (星闪) radio: WS63 module, dual joysticks, 18650 battery, plus the fbb_ws63 SDK and full dev-board documentation.',
    overview:
      'The NearLink controller is NEC’s hands-on project with the new short-range wireless standard, and part of the Haiou-Pai curriculum: design controller hardware around the WS63 module and drive a car — forward, reverse, speed and steering. The repo holds both real hardware photos and buildable SDK examples.',
    shared: [
      'WS63/WS63E solution SDK (fbb_ws63, built on the unified FBB framework) with an example index',
      'Hardware files, schematics and purchase links for three mainstream dev boards (HiHope / BearPi / HQYJ)',
      'Real photos: dual joysticks, direction/operation toggles, Type-C charging, 18650 power',
      'Peripheral examples (I2C/SPI/UART), OLED display and temperature/humidity demos',
      'Reference material on NearLink module porting, adaptation and compilation',
    ],
    audience: 'Anyone curious about NearLink, OpenHarmony, wireless controllers or low-latency remote control.',
    contribute:
      'Build application features on the existing SDK (key mapping, latency testing) or bring the NearLink link into other robot projects.',
    statusNote: 'Hardware prototype built; application features under development.',
  },
  '3': {
    tagline: 'Open-source exploration of a small humanoid robot',
    summary:
      'NEC’s humanoid track: the Duma small humanoid, an openEuler Embedded + NearLink traffic-scenario demo, and a curated index of mainstream open humanoid platforms.',
    overview:
      'Humanoid robots are a long-term direction for the community. This track currently has two parts: the Duma hardware and competition material (2025 Energy Saving & Emission Reduction contest), and a maintained index of open-source humanoid resources so newcomers can find reproducible platforms quickly.',
    shared: [
      'Duma material: NearLink + openEuler Embedded traffic-scenario demo and contest deliverables',
      'Platform index: Beijing Embodied AI Center, OpenLoong, Unitree, AgiBot, Fourier GRX and more',
      'RL and teleoperation references: unitree_rl_gym, kinect_teleoperate, agibot_x1',
      'Hardware supply: ROS controller boards, MicroROS boards, encoder motors, Raspberry Pi 5',
      'The NEC robotics community whitepaper (technical roadmap and collaboration model)',
    ],
    audience: 'Students wanting a systematic view of the humanoid stack, gait/control algorithms or hands-on work with Duma.',
    contribute:
      'Add new platforms to the index; on hardware, help with structural iterations, the NearLink remote link or host software.',
    statusNote: 'Long-term track: the resource index is maintained, hardware in development.',
  },
  '13': {
    tagline: 'A K230-vision wheel-legged robot dog for teaching',
    summary:
      'A wheel-legged robot dog based on K230 and KFS, integrating face/colour detection, IoT remote control and a robotic arm extension — modular code for teaching and competition entry.',
    overview:
      'MechDog exercises the coordination of sensing, control and mechatronics: ESP32/ESP32-S3 handle vision, the main controller runs IoT control and motion, and a robotic arm extends the platform. The README lays out a full learning path from environment setup to cross-module integration.',
    shared: [
      'Two main Python examples: IoT control and robotic arm control',
      'Complete ESP32/ESP32-S3 Arduino projects for face and colour detection',
      'K230 KFS detection models (.kmodel) and deployment configuration',
      'A staged learning path: setup → vision → IoT → arm → integration',
      'Auxiliary features: remote alarms, remote control, ranging, lighting',
    ],
    audience: 'Robotics beginners, and anyone learning how vision modules connect to motion control.',
    contribute:
      'Follow the vision → IoT → motion order, stabilising one module before integrating; swapping vision models and choreographing motions are good entry points.',
    statusNote: 'Module code complete; ongoing refinement and integration.',
  },
  '6': {
    tagline: 'An open-source dexterous hand under ¥10,000',
    summary:
      'Aiming to bring a dexterous hand below ¥10,000: coreless motors, tendon-driven transmission and multi-sensor fusion, with a modular, maintainable design and fully open documentation.',
    overview:
      'Commercial dexterous hands cost tens of thousands of yuan, out of reach for student teams. This research project pursues a low-cost, highly flexible hand: tendon transmission simplifies the mechanism, modularity reduces maintenance cost, and UR5 path-planning simulations support verification.',
    shared: [
      'Project brief: budget cap (≤ ¥10,000), timeline and team roles',
      'Technical route: coreless motor drive, tendon transmission, multi-sensor fusion',
      'UR robot path-planning simulation demo and MATLAB references',
      'Requirement breakdowns for industrial, medical and home-service scenarios',
    ],
    audience: 'Students interested in end effectors, mechanical design and low-cost actuation.',
    contribute:
      'We need mechanical structure, motor selection and control algorithm help; simulation and cost analysis contributions are also welcome.',
    statusNote: 'Research project: design and prototype iterations in progress.',
  },
  '7': {
    tagline: 'Mixed-criticality deployment of openEuler + RT-Thread on one chip',
    summary:
      'Validating the Chinese MICA framework: Linux and RT-Thread running on the same hardware, communicating over OpenAMP — an engineering baseline for robot runtimes.',
    overview:
      'Robots need Linux for vision and planning, and an RTOS for real-time motor control. MICA validates mixed deployment on one SoC: openEuler Embedded as the management domain and RT-Thread as the real-time domain, applied to a complete basketball launcher robot.',
    shared: [
      'The meta-rtthread Yocto layer: RT-Thread 4.1.0 recipe and openEuler BSP patch',
      'gcc-arm-none-eabi 11 cross-toolchain integration recipes',
      'MICA deployment docs, a Sphinx project and GitHub Actions deployment',
      'A full-machine case: basketball launcher robot (Raspberry Pi 5 + ESP32-S3, FRC ball-control approach)',
      'Supporting ideas: RedCap 5G + NearLink communication, PoE high-voltage transmission',
    ],
    audience: 'Anyone into embedded Linux builds, RTOS, mixed-criticality systems or the domestic OS ecosystem.',
    contribute:
      'Start with QEMU simulation, documentation or new board support; projects are expected to land upstream as PRs/MRs.',
    statusNote: 'Open integration-validation project; docs and build configs updated regularly.',
  },
  '4': {
    tagline: 'A PX4 dual-flight-controller communication experiment',
    summary:
      'A flight-control project started in May 2025: communication between two lower-level controllers and single-controller operation, built on PX4-Autopilot, with full process records.',
    overview:
      'This is the communication module of the flying-car group: three developers collaborating online with one progress shepherd. The goal was a working dual-controller communication and single-gamepad control link by the end of June. The repo keeps meeting notes and personal progress logs — a real sample of small-project collaboration.',
    shared: [
      'PX4-Autopilot open flight-controller resources and an onboarding path',
      'Progress and meeting records: task distribution, online training, weekly rhythm',
      'A lightweight collaboration model: three developers plus one progress shepherd',
    ],
    audience: 'Students curious about flight-control communication, MAVLink or online group collaboration.',
    contribute:
      'The project is archived at a milestone: continue from the records by completing the protocol implementation, organising test data or starting a new iteration.',
    statusNote: 'Milestone archive: complete process documentation, open for takeover.',
  },
  '8': {
    tagline: 'The 3D printing and rapid-prototyping group behind our robots',
    summary:
      'NEC’s 3D printing special interest group: one-stop support from CAD modelling to printed parts, serving robot structures, functional prototypes and small batches.',
    overview:
      'Robot projects live on structural iteration. Two members run the printing SIG: design review, material selection, process optimisation and post-processing — closing the loop from drawing to part, and giving newcomers hands-on prototyping practice.',
    shared: [
      'Real print records: photos of robot parts such as limit-switch structures',
      'Material selection and process optimisation experience (layer height, infill, post-processing)',
      'A complete workflow from design review to quality control',
      'How rapid prototyping and small-batch production are organised',
    ],
    audience: 'Anyone learning CAD or 3D printing, or needing parts printed for their own project.',
    contribute:
      'Bring your part requirements, or join the group to learn slicing parameters, material behaviour and post-processing.',
    statusNote: 'The SIG runs continuously, producing parts alongside robot projects.',
  },
  '14': {
    tagline: 'Where community experience becomes public knowledge',
    summary:
      'docs.newenergycoder.club: mechanical design, embedded software, machine vision, AI tooling and season documentation — built with Mintlify, continuously imported from the Feishu wiki.',
    overview:
      'The docs site is how NEC turns experience into shared assets: competition journeys from zero to one, LumenPnP pick-and-place assembly, ROS setup, newcomer training courses and governance rules — all searchable and citable. Every PR runs link and frontmatter checks.',
    shared: [
      'Four tutorial tracks: mechanical, embedded software, vision and AI tools',
      'CURC 2026/2027 season docs plus competition, project and weekly-report templates',
      'Newcomer entry: quick start, training courses, contribution guide, code of conduct',
      'The Feishu Wiki → MDX incremental import toolchain (the feishu-to-nec-mdx Skill)',
      'CDN rules for large files and llms.txt for AI crawlers',
    ],
    audience: 'Everyone. Newcomers start at Quick Start; veterans write up their project experience.',
    contribute:
      'The friendliest first contribution: write a tutorial, fix a dead link, add a figure. Run python tools/ci/check_docs.py before submitting.',
    statusNote: 'Continuously updated and deployed on every push.',
  },
  '15': {
    tagline: '150 AI coding skills plus an ESP32-S3 hardware baseline',
    summary:
      'A central home for 150 skills accumulated across Claude Code, Trae and Kimi CLI, with cross-toolchain configuration and the HXC ESP32-S3 board firmware project.',
    overview:
      'The SKill branch split off from the main repo to do two things: host the AI coding skill library (150 skills covering Feishu office work, front-end, documents, PV calculation) and maintain the HXC team’s ESP32-S3 board firmware and debugging docs. AI tooling and embedded hardware meet here.',
    shared: [
      '150 reusable AI coding skills: Feishu office, front-end development, document handling, PV and more',
      'Installation and configuration for Claude Code, Trae, QClaw and Kimi',
      'An ESP32-S3 (N16R8) PlatformIO firmware project and board usage guide',
      'CAN TWAI 1Mbps communication and position/current/position-mode control basics',
      'New-device setup and a cross-workspace vibe-coding debugging workflow',
    ],
    audience: 'Developers bringing AI assistants into daily work, and students writing ESP32-S3 firmware.',
    contribute:
      'Contribute a new skill or improve existing triggers and docs; on the embedded side, build peripheral drivers from the template project.',
    statusNote: 'New skills added continuously; firmware evolves with the hardware.',
  },
  '5': {
    tagline: 'Real briefs from companies and open-source communities',
    summary:
      'NEC’s channel to real demand: Haiou-Pai 5G video links, YOLOv8 deployment, AGL adaptation, lidar navigation, pneumatic control — with requirements, delivery standards and process docs all public.',
    overview:
      'A collection of projects commissioned with companies and open-source communities. Each has a defined hardware platform, requirements and delivery standards (source code + process docs + courseware), giving participants near-real engineering training; some require contributing back upstream via PR.',
    shared: [
      'Brief list: 5G RedCap video links, YOLOv8 porting, ROS setup, lidar mapping/navigation/following/angle masking',
      'A completed case: the pneumatic control system (valve–tank–cylinder–quick-exhaust chain, with parameters)',
      'AGL adaptation on openEuler Embedded (QEMU + Raspberry Pi 5 verification)',
      'Process docs: power management, HiCar Pi 5 progress, the basketball launcher robot',
      'Topic references and delivery templates, suitable as capstone/innovation-project sources',
    ],
    audience: 'Students looking for real briefs, capstone topics or university–industry collaboration.',
    contribute:
      'Claim a topic from the list or submit documentation for work you completed; new briefs are coordinated with maintainers via issues.',
    statusNote: 'The topic pool is updated continuously; some delivered, others open to claim.',
  },
}
