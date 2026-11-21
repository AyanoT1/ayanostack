# AyanoStack

Skills personales para flujos de ingeniería que uso tanto en la pega como en mis proyectos personales. La estructura toma como referencia [pstack de Lauren Tan (poteto)](https://github.com/cursor/plugins/tree/main/pstack).

## Estructura

| Ruta | Propósito |
| --- | --- |
| `skills/` | Una carpeta con `SKILL.md` por flujo reutilizable. |
| `skills/ayanostack-mode/playbooks/` | Espacio para las guías por tipo de tarea que consultará `ayanostack-mode`. |
| [Perfiles](docs/profiles/) | Herramientas de cada entorno y cómo seleccionar el perfil. |

El primer commit contiene la estructura inicial. `ayanostack-mode` será el punto de entrada que elija un playbook según la tarea y use las skills que hagan falta.

## Perfiles por proyecto

- [Bitbucket + Jira](docs/profiles/bitbucket-jira.md) para el trabajo.
- [GitHub](docs/profiles/github.md) para proyectos personales.

En el `AGENTS.md` del proyecto, declara el perfil con una línea como `Para las skills de AyanoStack, usa el perfil bitbucket-jira.` Para un proyecto personal, usa `github`. Cada skill que dependa de la plataforma debe pedir el perfil si el proyecto no lo declara.

Cada `SKILL.md` define el flujo común. Cuando una skill necesite comandos o convenciones de una plataforma, sus referencias van en su propio directorio `references/`. La skill indica cuál leer para el perfil activo, de modo que esas instrucciones viajen junto con ella al instalarla.

## Antes de comitear

Este repositorio es público. Revisa lo que vas a comitear para detectar credenciales, datos personales y material interno del trabajo. La [regla de revisión](AGENTS.md#antes-de-cada-commit) indica qué revisar.
