# Instrucciones para AyanoStack

## Antes de cada commit

Revisa la lista de archivos con `git diff --cached --name-status` y el contenido con `git diff --cached`. Si el diff no muestra el contenido de un archivo, revísalo directamente. Repite la revisión antes de hacer push si cambió lo que vas a publicar.

Mantén fuera del repositorio los tokens, claves, contraseñas, archivos `.env` con valores reales, datos personales y material interno del trabajo. Esto también aplica a los ejemplos de comandos, exportaciones, logs y capturas que acompañen a una skill. Usa valores ficticios en los ejemplos.

Si encuentras material sensible, retíralo de lo que se va a comitear y revisa de nuevo. Si ya está en un commit local, limpia ese commit antes de hacer push.

## Lo que las skills dejan en un proyecto

Todo lo que una skill escribe dentro del repositorio de un proyecto (perfiles como `ship-bar.md`, registros de incidentes, configuración o notas para agentes) va en la carpeta `.ayanostack/` de ese repo. Esa carpeta la ignora el gitignore global del usuario (`git config --global core.excludesFile`), nunca el `.gitignore` del proyecto.

Ninguna skill comitea, crea ramas ni hace push de esos archivos. Cada dev tiene sus propias skills instaladas, y un archivo de agente comiteado cambia cómo se comportan los agentes del resto del equipo. La configuración de AyanoStack de un proyecto también es personal: va en `.ayanostack/AGENTS.md` o en un `AGENTS.md` de una carpeta superior fuera de git, nunca en el `AGENTS.md`, `CLAUDE.md` ni carpeta de reglas que versione el repo. Los providers la encuentran por una indicación en sus instrucciones globales personales. Antes de escribir en un proyecto, `skills/ayanostack/scripts/personal-path.sh <ruta>` debe aprobar la ruta; ver [configuración personal](skills/ayanostack/references/personal-config.md).

Al agregar o revisar una skill, verifica que no indique escribir fuera de `.ayanostack/` en un proyecto ni comitear lo que genera.

## Lo que las skills le escriben a una persona

Toda respuesta, reporte, descripción de PR, comentario en el tracker o página HTML que produce una skill sigue [respuestas simples](skills/ayanostack/references/plain-replies.md). Al agregar una skill, enlázala desde la sección donde la skill define su respuesta.

## Antes de hacer push

Corre `node scripts/check-skills.mjs` y corrige lo que reporte. Si cambiaste `evals/graders.mjs` o un `scenarios.json`, corre también `node --test evals/graders.test.mjs`.
