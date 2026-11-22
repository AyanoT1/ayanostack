# Order format

An order is a JSON object with an optional discount `code` and a list of `items`.

Each item has:

- `sku`: the product code.
- `price`: the unit price in cents.
- `qty`: how many units were ordered, an integer of at least 1.
