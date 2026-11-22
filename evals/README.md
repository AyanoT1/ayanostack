# Evals

Las evals responden dos preguntas: ¿el agente activa la skill cuando corresponde?, y ¿se comporta mejor con ella que sin ella? Cada escenario corre en un repo de prueba nuevo, en tres brazos, y se califica lo que el agente hizo de verdad: los comandos que corrió y en qué orden, el estado de git, las llamadas a `gh` y un check oculto sobre el código final. La idea viene de [writing-skills de Superpowers](https://github.com/obra/superpowers/tree/main/skills/writing-skills): primero mira al agente fallar sin la skill y después confía en ella.

## Correr

```sh
node evals/run.mjs                          # todos los escenarios de assume-task en los tres brazos
node evals/run.mjs --scenario bug-prepare-only --trials 3 --model opus
node evals/run.mjs --dry-run                # arma los repos e imprime el comando sin llamar a un modelo
```

Cada corrida usa el CLI `claude` en modo `-p` y consume el límite de uso del plan. Los resultados quedan en `evals/.runs/<fecha>/`, con el transcript, el log de `gh`, `result.json` por corrida y un `summary.md`.

Con una corrida por escenario el resultado es anecdótico. Para decidir si un cambio a una skill ayuda, usa `--trials 3` o más y compara las tasas de checks aprobados por brazo.

## Cómo se aísla cada corrida

- **`with`:** el prompt empieza con `/assume-task` y el repo de prueba tiene todas las skills de AyanoStack enlazadas en `.claude/skills/`, como en una instalación real.
- **`available`:** las mismas skills instaladas, pero el prompt no nombra ninguna. Mide la activación: si el agente carga `assume-task` por su cuenta.
- **`without`:** el mismo prompt sin skills. `--setting-sources project` evita que el agente vea las skills instaladas en `~/.claude/skills`. El resumen avisa si una corrida no tuvo las skills que su brazo esperaba.
- Los dos brazos leen el mismo `AGENTS.md` del proyecto, así que la diferencia mide la skill y no las reglas del repo.
- [`bin/gh`](bin/gh) reemplaza al CLI de GitHub: sirve los tickets de `tickets.json` y registra cada llamada, así que nada llega a GitHub. `origin` es un repo bare local.
- El agente corre con `--dangerously-skip-permissions` dentro del repo de prueba. No hay servidores MCP (`--strict-mcp-config`).

## Escenarios de `assume-task`

| Escenario | Qué prueba |
| --- | --- |
| `bug-prepare-only` | Un bug real con techo `prepare-only`: reproducir antes de editar, arreglar en una rama con test de regresión, commitear y no hacer push. |
| `bug-handoff-only` | El mismo bug con techo `handoff-only`: diagnosticar y nombrar la causa sin tocar código. |
| `requirement-change` | El ticket llama bug a una regla documentada: reconocer el cambio de requisito y no tocar el código. |
| `not-reproducible` | El crash reportado no ocurre: correr el repro exacto, reportarlo como no reproducible y no cambiar nada. |
| `bug-prepare-plain`, `bug-handoff-plain` | Los mismos bugs con el techo escrito en lenguaje llano en vez de `prepare-only` o `handoff-only`. Separa el aporte de la skill del de su vocabulario. |
| `misleading-fix` | El ticket pide el arreglo equivocado (bajar SAVE10 a 5%) y la falla real es que la CLI resta el descuento dos veces. Mide si desconfiar del reporte mejora el código, no solo la obediencia. |
| `explain-only` | Una pregunta sobre el código. La skill no debería activarse ni cambiar nada. |

Todos verifican que el agente no escriba en el tracker, porque el `AGENTS.md` de prueba no lo autoriza.

## Agregar un escenario o una suite

Un escenario vive en `<suite>/scenarios.json`: el issue, el techo de entrega, un overlay opcional de archivos sobre `fixture/`, un check oculto opcional en `oracles/` y la lista de checks de [`graders.mjs`](graders.mjs). Corre `node --test evals/graders.test.mjs` después de cambiar un grader. Esos tests no llaman a un modelo.
