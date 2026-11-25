# Plantilla de `AGENTS.md` por proyecto

Copia las secciones relevantes a tu configuración personal del proyecto y rellena los valores reales. Esa configuración nunca va en un archivo que el repo versione: usa `.ayanostack/AGENTS.md` en la raíz del repo (ignorado por el gitignore global) o un `AGENTS.md` en una carpeta superior que no esté dentro de ningún repo. `install` deja en las instrucciones globales de cada provider la indicación para encontrarla; ver [configuración personal](personal-config.md). Las skills de AyanoStack leen estas reglas para saber qué plataforma usar, hasta dónde pueden avanzar solas y qué pueden escribir en el tracker.

> **Providers:** no agregues `@AGENTS.md` ni líneas de AyanoStack al `CLAUDE.md` o `AGENTS.md` del repo. Cada provider encuentra esta configuración por la indicación en sus instrucciones globales personales (`~/.claude/CLAUDE.md`, `~/.codex/AGENTS.md`, `~/.gemini/GEMINI.md`).

```markdown
# Instrucciones del proyecto para AyanoStack
<!-- ayanostack: <commit corto> <YYYY-MM-DD> --> <!-- `install` lo escribe y lo usa para saber qué cambió desde la última instalación. -->

## Perfil y plataforma
Para las skills de AyanoStack, usa el perfil `github`. <!-- o `bitbucket-jira` -->

- Repositorio / remoto: `origin`
- Rama base de PRs: `main` <!-- o `develop`, `staging`, etc. -->

## Tableros y fuentes de tickets (`triage`)
<!-- Lista todas las fuentes que `triage` debe leer para armar el snapshot diario. -->
- **Mantenimiento / Bugs:** tablero o query `<ID o filtro>` — foco: asignados a mí + sin asignar urgentes o próximos a vencer.
- **Mejora continua:** tablero o query `<ID o filtro>` — foco: asignados a mí.
- **Proyecto activo:** tablero o query `<ID o filtro>` — foco: asignados a mí.
- **Criterios de caducidad / SLA:** `<ej. bugs críticos < 24h, tickets con fecha límite en los próximos 3 días>`.

## Autonomía y techo de entrega (`assume-task` / `open-pr`)
- `handoff-only`: solo diagnóstico. No edites código ni hagas commits.
- `prepare-only`: arregla en una rama nueva y commitea localmente. No hagas push ni abras PR.
- `draft-pr`: publica la rama y abre el PR como borrador.
- `open-pr`: publica la rama y abre el PR listo para revisión. No mergees.
- `merge-main`: mergea a la rama base solo si pasan todos los checks requeridos.

- **Techo por defecto:** `prepare-only` <!-- En trabajo: deja rama, commits, pre-PR y descripción listos justo antes del push. En repo personal sin prod: `open-pr` o `merge-main`. -->
- **Excepciones por tablero:**
  - Mantenimiento (`easy-fix` / `bug` acotado): `prepare-only`
  - Cambios de arquitectura, `feature-request` o `research`: `handoff-only`

## Escritura en el tracker (`triage` / `assume-task`)
<!-- Define qué operaciones sobre Jira o GitHub Issues están autorizadas sin pedir confirmación previa. -->
- **Mover estado al asumir:** sí (`To Do` → `In Progress`) <!-- o `no` -->
- **Comentar evidencia verificada:** sí (sin credenciales ni datos sensibles) <!-- o `no` -->
- **Etiquetar según clasificación:** sí (`easy-fix`, `bug`, `critical-bug`, `feature-missing`, `feature-request`, `requirement-change`, `research`, `architecture-decision`, `architecture-design`) <!-- o `no` -->
- **Cerrar o reasignar tickets:** no (siempre confirmar)

## Ejecución local para verificación en vivo (`assume-task`)
- **Levantar app / API:** `<comando, ej. pnpm dev>`
- **URL base / healthcheck:** `<ej. http://localhost:3000/health>`
- **Autenticación local de prueba:** `<cómo obtener sesión de prueba sin guardar secretos en el repo>`

## Checks obligatorios y revisión (`open-pr` / `babysit-pr`)
- **Checks locales antes de publicar:** `<ej. pnpm typecheck && pnpm lint && pnpm test>`
- **Checks de CI requeridos:** `<nombres de checks o pipelines>`
- **Checklist de PR:** `<reglas de título, vínculo a ticket/issue, migraciones, capturas>`

## Listón de entrega (`shippable`)
<!-- El perfil es personal: vive en `.ayanostack/` dentro de cada repo, ignorado por el gitignore global, y nunca se comitea. Créalo con `shippable` en modo `survey`. -->
- Ship bar: `.ayanostack/ship-bar.md`

## Modelos por rol (`interrogate` / `swarm`)
<!-- Solo modelos disponibles. `inherit` usa el modelo del chat. -->
- `interrogate reviewers`: `<modelo A> high, <modelo B> high` <!-- Incluye al menos un modelo de otra familia que el que escribe el código: el consejo de `interrogate` es ciego y los jueces favorecen código parecido al suyo. -->
- `swarm workers`: `inherit`
```
