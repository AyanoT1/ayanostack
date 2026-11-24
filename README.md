# AyanoStack

Skills personales para flujos de ingeniería que uso en la pega y en mis proyectos personales. La base toma como referencia [pstack de Lauren Tan (poteto)](https://github.com/cursor/plugins/tree/7a583913eb1b8d1a0ee76753d1a2cf072e7b54f9/pstack).

## Estructura

| Ruta | Propósito |
| --- | --- |
| `skills/` | Una carpeta con `SKILL.md` por flujo reutilizable. |
| [Perfiles](docs/profiles/) | Herramientas de cada entorno y cómo seleccionar el perfil. La plantilla de `AGENTS.md` vive en [`install`](skills/install/references/agents-template.md). |
| [`scripts/check-skills.mjs`](scripts/check-skills.mjs) | Revisa frontmatter, tamaño, enlaces y créditos de cada skill antes de hacer push. |
| [`evals/`](evals/README.md) | Compara el comportamiento del agente con y sin una skill en repos de prueba. |

## Daily use

- [`babysit-pr`](skills/babysit-pr/SKILL.md) sigue la revisión y CI del PR abierto hasta que esté listo o aparezca un bloqueo.
- [`blast-radius`](skills/blast-radius/SKILL.md) busca qué puede romperse fuera del diff y prueba el supuesto que hace seguro el cambio.
- [`ketchup`](skills/ketchup/SKILL.md) pone al día sobre lo que cambió desde el último mensaje del chat y qué decisiones quedan.
- [`no-comments`](skills/no-comments/SKILL.md) revisa comentarios y los workarounds que revelan, con [Comment Sicko](skills/no-comments/references/comment-sicko.md) como revisor.

## Probando

- [`aita`](skills/aita/SKILL.md) ("Am I The A##hole?", al estilo Reddit) busca tickets y PRs de compañeros que esperan tu trabajo sin terminar y los ordena por la urgencia de lo bloqueado, no por la tuya. `triage` la usa para subir de prioridad lo que bloquea a otros.
- [`assume-task`](skills/assume-task/SKILL.md) asume un ticket o tarea, replica el fenómeno en vivo con evidencia real (JSON, logs o capturas), clasifica el trabajo (`auto`, `investigate` o `drive`) y llega hasta el techo de entrega definido en `AGENTS.md`.
- [`benchmark-checklist`](skills/benchmark-checklist/SKILL.md) valida que una medición de rendimiento sostenga la conclusión.
- [`garden`](skills/garden/SKILL.md) hace mantenimiento de repositorio (código repetido, docs desfasados, higiene y [correct](skills/garden/references/correct.md) para convertir errores recurrentes en restricciones del código).
- [`gc`](skills/gc/SKILL.md) audita worktrees, ramas y residuos, y borra únicamente los elementos confirmados.
- [`improve-architecture`](skills/improve-architecture/SKILL.md) presenta oportunidades concretas de refactor en un informe HTML.
- [`install`](skills/install/SKILL.md) instala o enlaza las skills en tu máquina y configura el `AGENTS.md` de un repositorio a partir de la plantilla.
- [`interrogate`](skills/interrogate/SKILL.md) intenta romper el cambio y solo reporta hallazgos que una ejecución prueba. Usa el panel de revisores declarado en el `AGENTS.md` del proyecto. Solo se invoca a pedido (`/interrogate`) o desde otra skill que la enlaza.
- [`open-pr`](skills/open-pr/SKILL.md) prepara, abre o actualiza un PR con el checklist del proyecto.
- [`overnight`](skills/overnight/SKILL.md) ejecuta trabajo largo y desatendido (`todo-list`, `implement-feature`, `research-feature`, `fixes`, `gardening`) aprovechando el tiempo disponible para verificar a fondo y cerrar con un reporte en HTML (`press-release`).
- [`press-release`](skills/press-release/SKILL.md) entrega un enlace al anuncio de lanzamiento en HTML.
- [`recall`](skills/recall/SKILL.md) recupera contexto reciente de un tema entre chats y lo contrasta con el estado actual.
- [`reflect`](skills/reflect/SKILL.md) convierte lecciones de una sesión en propuestas concretas para el flujo de trabajo.
- [`simplify-diff`](skills/simplify-diff/SKILL.md) recorta un diff tras buscar primero lo que ya resuelve el repo.
- [`swarm`](skills/swarm/SKILL.md) reparte un trabajo en paralelo o compara modelos por encargo. Queda para tareas que justifiquen ese costo, así que solo se invoca a pedido (`/swarm`).
- [`triage`](skills/triage/SKILL.md) revisa los tableros declarados en `AGENTS.md`, arma un snapshot diario priorizado (asignados a ti + urgentes sin asignar), marca candidatos delegables y lanza threads de `assume-task` tras tu confirmación.
- [`typescript-best-practices`](skills/typescript-best-practices/SKILL.md) revisa contratos y tipos siguiendo las convenciones del proyecto.
- [`why`](skills/why/SKILL.md) reconstruye el motivo de una decisión con fuentes y evidencia.

## Flujo de trabajo y PR

Usa [`install`](skills/install/SKILL.md) para enlazar las skills en una misma raíz y que sus referencias relativas funcionen en Claude Code, Codex, Antigravity y T3 Code.

- **Entrada diaria:** [`triage`](skills/triage/SKILL.md) revisa los tableros declarados en `AGENTS.md` y lanza [`assume-task`](skills/assume-task/SKILL.md) sobre los tickets confirmados para replicar en vivo, clasificar y avanzar hasta el techo del proyecto.
- **Cierre de PR:** [`open-pr`](skills/open-pr/SKILL.md) prepara el cambio con [pre-PR](skills/open-pr/references/pre-pr.md) ([causa raíz](skills/open-pr/references/right-fix.md), `simplify-diff`, `no-comments`, `interrogate` y `blast-radius`). Tras los checks del proyecto, publica el PR, audita residuos con `gc` y entrega seguimiento a `babysit-pr`. Para revisar sin publicar, pide `open-pr` en modo preparación.

## Perfiles por proyecto

- [Bitbucket + Jira](docs/profiles/bitbucket-jira.md) para el trabajo.
- [GitHub](docs/profiles/github.md) para proyectos personales.
- [Plantilla de `AGENTS.md`](skills/install/references/agents-template.md) para configurar tableros, techo de autonomía (`prepare-only`, `open-pr`, `merge-main`), escritura en el tracker, verificación local y modelos por rol de `interrogate` y `swarm` por proyecto.

En el `AGENTS.md` de cada proyecto declara el perfil con una línea como `Para las skills de AyanoStack, usa el perfil bitbucket-jira.` Para un proyecto personal, usa `github`. Ahí mismo deja los tableros de `triage`, el techo de entrega de `assume-task`, permisos de escritura en el tracker, cómo levantar la app en local, el checklist de PR y los checks requeridos.

Cada `SKILL.md` define el flujo común. `triage`, `assume-task`, `open-pr` y `babysit-pr` leen únicamente la referencia del perfil declarado. La máquina personal usa `gh` o las herramientas de T3 Code para GitHub. La del trabajo usa `twg` para Bitbucket y Jira. Si falta el perfil o la autorización de escritura, confírmalo antes de escribir en una plataforma.

## Verificación

- `node scripts/check-skills.mjs` revisa que cada skill tenga frontmatter válido, que su `SKILL.md` no pase de 20.000 bytes, que sus enlaces relativos existan y no salgan de `skills/` (así funcionan instaladas como symlinks hermanos), y que toda skill adaptada conserve su crédito y su licencia. El [`AGENTS.md`](AGENTS.md) pide correrlo antes de hacer push.
- [`evals/`](evals/README.md) corre escenarios reales de `assume-task` con y sin la skill y califica lo que hizo el agente. Se corre a mano.

## Créditos

AyanoStack parte de [pstack](https://github.com/cursor/plugins/tree/7a583913eb1b8d1a0ee76753d1a2cf072e7b54f9/pstack) de Lauren Tan ([poteto](https://github.com/poteto)), con licencia MIT, y mucho de este repo es trabajo suyo. Cada skill adaptada o inspirada en otra fuente conserva la licencia original en su carpeta y un comentario con el enlace al archivo de origen. `scripts/check-skills.mjs` falla si una skill pierde ese crédito.

| Fuente | Qué viene de ahí |
| --- | --- |
| [pstack](https://github.com/cursor/plugins/tree/7a583913eb1b8d1a0ee76753d1a2cf072e7b54f9/pstack), Lauren Tan | Adaptadas: `babysit-pr` (playbook babysit), `benchmark-checklist`, `blast-radius`, `gc` (playbook worktree-cleanup), `interrogate`, `ketchup`, `no-comments`, `recall`, `reflect`, `swarm`, `typescript-best-practices`, `why` y `correct` (dentro de `garden`). Inspiradas: `assume-task` (playbooks bug-fix e investigation), `open-pr` (playbook opening-a-pr y el principio fix-root-causes), `overnight` (guía overnight) e `install` (líneas de modelo por rol de setup-pstack). |
| [improve-codebase-architecture](https://github.com/mattpocock/skills/tree/main/skills/engineering/improve-codebase-architecture), Matt Pocock | `improve-architecture`. |
| [antfu-simplify](https://github.com/antfu/skills/tree/main/skills/antfu-simplify), Anthony Fu | `simplify-diff`. |
| [Superpowers](https://github.com/obra/superpowers), Jesse Vincent | La idea de las evals (ver fallar al agente sin la skill antes de confiar en ella, como en su skill writing-skills) y el límite de tamaño de `SKILL.md`. |
| [Compound Engineering](https://github.com/EveryInc/compound-engineering-plugin), Every | El check de que una skill no enlace fuera de `skills/`. |
| Anthropic y Andrej Karpathy | `overnight` también toma los patrones de Anthropic para harness de larga duración y el ratchet loop de Karpathy. |

## Antes de comitear

Este repositorio es público. Revisa lo que vas a comitear para detectar credenciales, datos personales y material interno del trabajo. La [regla de revisión](AGENTS.md#antes-de-cada-commit) indica qué revisar.
