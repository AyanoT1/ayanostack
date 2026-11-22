# AyanoStack

Skills personales para flujos de ingeniería que uso en la pega y en mis proyectos personales. La base toma como referencia [pstack de Lauren Tan (poteto)](https://github.com/cursor/plugins/tree/7a583913eb1b8d1a0ee76753d1a2cf072e7b54f9/pstack).

## Estructura

| Ruta | Propósito |
| --- | --- |
| `skills/` | Una carpeta con `SKILL.md` por flujo reutilizable. |
| `skills/ayanostack-mode/playbooks/` | Espacio para las guías por tipo de tarea que consultará `ayanostack-mode`. |
| [Perfiles](docs/profiles/) | Herramientas de cada entorno y cómo seleccionar el perfil. |

## Daily use

- [`babysit-pr`](skills/babysit-pr/SKILL.md) sigue la revisión y CI del PR abierto hasta que esté listo o aparezca un bloqueo.
- [`blast-radius`](skills/blast-radius/SKILL.md) busca qué puede romperse fuera del diff y prueba el supuesto que hace seguro el cambio.
- [`ketchup`](skills/ketchup/SKILL.md) pone al día sobre lo que cambió desde el último mensaje del chat y qué decisiones quedan.
- [`no-comments`](skills/no-comments/SKILL.md) revisa comentarios y los workarounds que revelan, con [Comment Sicko](skills/no-comments/references/comment-sicko.md) como revisor.

## Probando

- [`benchmark-checklist`](skills/benchmark-checklist/SKILL.md) valida que una medición de rendimiento sostenga la conclusión.
- [`correct`](skills/correct/SKILL.md) convierte errores recurrentes en restricciones del código o verificaciones reproducibles.
- [`gc`](skills/gc/SKILL.md) audita worktrees, ramas y residuos, y borra únicamente los elementos confirmados.
- [`improve-architecture`](skills/improve-architecture/SKILL.md) presenta oportunidades concretas de refactor en un informe HTML.
- [`interrogate`](skills/interrogate/SKILL.md) revisa el cambio con evidencia. En T3 Code puede usar un panel independiente configurable, con preferencia por Neon.
- [`open-pr`](skills/open-pr/SKILL.md) prepara, abre o actualiza un PR con el checklist del proyecto.
- [`press-release`](skills/press-release/SKILL.md) entrega un enlace al anuncio de lanzamiento en HTML.
- [`recall`](skills/recall/SKILL.md) recupera contexto reciente de un tema entre chats y lo contrasta con el estado actual.
- [`reflect`](skills/reflect/SKILL.md) convierte lecciones de una sesión en propuestas concretas para el flujo de trabajo.
- [`simplify-diff`](skills/simplify-diff/SKILL.md) recorta un diff tras buscar primero lo que ya resuelve el repo.
- [`swarm`](skills/swarm/SKILL.md) reparte un trabajo en paralelo o compara modelos por encargo. Queda para tareas que justifiquen ese costo.
- [`typescript-best-practices`](skills/typescript-best-practices/SKILL.md) revisa contratos y tipos siguiendo las convenciones del proyecto.
- [`why`](skills/why/SKILL.md) reconstruye el motivo de una decisión con fuentes y evidencia.

## Pendientes de probar o revisar

- `arena` podría servir para comparar soluciones al mismo encargo. La revisión con varios modelos ya se puede pedir desde `interrogate`.
- `show-me-your-work` encaja si una tarea larga y desatendida necesita dejar una bitácora de decisiones que un revisor pueda auditar. Para un PR rutinario, esa evidencia suele caber en la descripción.
- Los `principle-*` quedan pendientes de medir. Para probar si uno aporta, toma tareas donde se esperaría que aplique y registra si se cargó, qué decisión cambió y qué resultado verificable produjo. `principle-attack-the-premise` tiene un primer caso en la guía de causa raíz de `open-pr` cuando se repiten workarounds.

## Flujo de PR

Instala las skills del flujo en una misma raíz para que sus referencias relativas funcionen. `open-pr` prepara el cambio con [pre-PR](skills/open-pr/references/pre-pr.md), que revisa la [causa raíz](skills/open-pr/references/right-fix.md), simplifica, aplica `no-comments` y verifica con `interrogate` y `blast-radius`. La revisión que antes hacía `pre-review` vive en `interrogate`. Las decisiones de arquitectura que afectan el cambio se revisan con la causa raíz.

Después de las verificaciones del proyecto, `open-pr` publica el PR, pasa por la auditoría `gc` y entrega el PR a `babysit-pr`. Para revisar sin publicar, pide a `open-pr` solo la preparación.

## Perfiles por proyecto

- [Bitbucket + Jira](docs/profiles/bitbucket-jira.md) para el trabajo.
- [GitHub](docs/profiles/github.md) para proyectos personales.

En el `AGENTS.md` de cada proyecto declara el perfil con una línea como `Para las skills de AyanoStack, usa el perfil bitbucket-jira.` Para un proyecto personal, usa `github`. Ahí mismo deja el checklist de PR, los checks requeridos y cualquier convención local.

Cada `SKILL.md` define el flujo común. `open-pr` y `babysit-pr` leen únicamente la referencia del perfil declarado. La máquina personal usa `gh` o las herramientas de PR de T3 Code para GitHub. La del trabajo usa `twg` para Bitbucket y Jira. Si falta el perfil, confírmalo antes de escribir en una plataforma.

## Antes de comitear

Este repositorio es público. Revisa lo que vas a comitear para detectar credenciales, datos personales y material interno del trabajo. La [regla de revisión](AGENTS.md#antes-de-cada-commit) indica qué revisar.
