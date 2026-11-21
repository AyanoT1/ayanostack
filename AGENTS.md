# Instrucciones para AyanoStack

## Antes de cada commit

Revisa la lista de archivos con `git diff --cached --name-status` y el contenido con `git diff --cached`. Si el diff no muestra el contenido de un archivo, revísalo directamente. Repite la revisión antes de hacer push si cambió lo que vas a publicar.

Mantén fuera del repositorio los tokens, claves, contraseñas, archivos `.env` con valores reales, datos personales y material interno del trabajo. Esto también aplica a los ejemplos de comandos, exportaciones, logs y capturas que acompañen a una skill. Usa valores ficticios en los ejemplos.

Si encuentras material sensible, retíralo de lo que se va a comitear y revisa de nuevo. Si ya está en un commit local, limpia ese commit antes de hacer push.
