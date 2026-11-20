# SUNCOAST: HEATLINE: source outline

Plain static files under `game/`, no build step, no bundler. Three.js 0.160.0
is vendored locally at `game/vendor/three.module.min.js`. Entry point
`main.ts` hands the game in; serve it with `node serve.ts`.

## Layout

- `game/src/config.js`: tuning, the 8-mission economy, REP and wanted
  progression, and the screenshot staging table, one source of truth for
  every HUD value in every submitted frame.
- `game/src/world.js`: sunset sky with sun disc and halo, soft clouds, the
  animated ocean and foam line, beach and boardwalk, 190+ buildings with lit
  windows, leafy palms, the turning ferris wheel, pier, lighthouse, kiosks
  and the container yard. Procedural canvas textures only.
- `game/src/vehicles.js`: the HEATLINE GT hero coupe (sloped hood, raked
  glass, flared arches, spoiler, twin exhausts, driver), traffic cars,
  police interceptors, the SKY-1 helicopter with spotlight cone and road
  pool, walkers, the on-foot player with pistol and muzzle flash, and yard
  enemies with health bars.
- `game/src/main.js`: boot and render loop, arcade driving and walking, the
  mission state machine, police pursuit, pedestrians that scatter, on-foot
  combat, the HUD with minimap, pause and save, and the `?shot=`
  screenshot staging.
- `game/src/audio.js`: WebAudio synth, engine, gunfire, pickups and three
  original radio stations (SHORELINE 96.7, PIER 102.5, DUNE 89.9).
- `game/index.html`: canvas plus the full HUD: mission panel, money and
  status, named police panel, radio and weapons, speedometer, round
  minimap, dialogue card, pause menu and title screen.
- `game/vendor/`: Three.js 0.160.0 and its MIT licence.
- `game/THIRD-PARTY-NOTICES.md`: third-party licences.

## Economy

Start cash $1,250. Story payouts $19,750 across 8 jobs, plus $450 of yard
bounties (3 targets at $150), for a loop total of $22,450. REP runs
0, 1, 2, 3, 5, 6, 7, 8 across jobs 1–8 and ends at 10. Wanted is 0 for jobs
1–3, 2 for job 4, 3 for job 5, 4 for job 6, 1 for jobs 7–8.

## Screenshots

`?shot=start|play|chase|mission|end` with `&seed=1` stages the five scenes
from the staging table in `config.js`. The four submitted shots are listed
in `shots.json`; the end scene (`?shot=end`) is prepared in-game but not
submitted, because the kit caps `screenshots/` at four.
