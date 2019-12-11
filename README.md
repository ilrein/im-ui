http://localhost:3000/shopify?shop=inventory-manager-1991.myshopify.com

### Goals
 1) get count of shopify products
 2) get count of elasticsearch products referenced by store
 3) sync the data
 4) search the elasticsearch data by any index
 5) display the result
 6) allow a way to edit it

 curl -XPOST http://localhost:9200/inventory-manager-1991.myshopify.com/_bulk -d ' { "index": { "_index:": "inventory-manager-1991.myshopify.com", "_type": "product, "_id": 123 }, { "title": "Pokemon Hat", "price": 1000, "id": 123 } } '