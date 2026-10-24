# Skills and the knowledge index

TiTools provides task-oriented skills and reference documents for Titanium SDK,
Alloy and related native modules. A skill describes when its workflow applies;
its references supply the details needed for that task.

The optional knowledge index helps an assistant find the available references
from the consuming project's instruction files. It is navigation, not a copy
of every reference and not a promise about an assistant's answer accuracy.

## Generate an index

From a Titanium project containing `tiapp.xml`, run:

```sh
titools sync
```

Select the applicable instruction files, such as `AGENTS.md`, `CLAUDE.md` or
`GEMINI.md`. TiTools maintains a delimited index block rather than replacing the
project's other instructions. Re-running sync updates that block.

Do not run project sync from the TiTools source repository. Installing skills
and generating an index in a consuming app are separate operations.

## Choose the relevant skills

The catalog contains thirteen public skills:

| Task | Skill |
| --- | --- |
| Reuse and simplification | `ti-reuse-first` |
| Architecture and implementation | `ti-expert` |
| PurgeTSS styling and assets | `purgetss` |
| Titanium UI | `ti-ui` |
| Native game behavior | `ti-game` |
| Visual and sound asset production | `ti-game-assets` |
| Native synthesis | `ti-synthengine` |
| Unified advertising | `ti-admob-unified` |
| Exact Titanium APIs | `ti-api` |
| SDK fundamentals | `ti-guides` |
| Native integrations | `ti-howtos` |
| Alloy MVC | `alloy-guides` |
| Alloy CLI and debugging | `alloy-howtos` |

Conditional scopes depend on the app. A Titanium project does not automatically
need PurgeTSS, games, synthesis or advertising. The `ti-pro` research agent can
combine the relevant references for questions that cross those boundaries.

## Keep references current

Update the installed TiTools package and use `titools update` to refresh installed
content. Use `titools status` and `titools doctor` to inspect installation health.
An index cannot establish which native module binary is installed: check that
module's release and artifact contract separately.

See [example prompts](examples.md) and the [CLI documentation](../README.md).
