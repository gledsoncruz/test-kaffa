# Kaffa - Pre-qualification test (v1.8)

## Notes

Third Libraries:

- Vuejs (https://vuejs.org/)
- Axios (https://github.com/axios/axios)
- Moment (https://momentjs.com/)

## Instructions

The app is running on github pages and can be accessed by the link below:

https://gledsoncruz.github.io/test-kaffa/

...or just make a clone of the repository and simply open the index.html file in your browser.

**Importante**: Item 6 of the exercise is not working on github pages because the url of the request server is not https, generating a security problem, but to see that same item working, just run the index.html locally in your browser after you have done clone.

## Exercises

Answer the exercises following the criteria:

- Presentation of the content
- Correctness of the solution
- Code organization
- Techniques and practices
- Complexity sof the exercises
- Time to completion

## 1) Validate CNPJ format (Mask)

Given a string, check if it looks like a CNPJ, considering two formats:

- Formatted:
  `"00.000.000/0000-00"`

- Number only:
  `"00000000000000"`

```javascript
// validate CNPJ format only

checkFormatCNPJ:  function (cnpj) {
	var  re_cnpj_formated = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/;
	var  re_cnpj_number_only = /^\d{14}$/;
	if (re_cnpj_formated.test(cnpj) || re_cnpj_number_only.test(cnpj)) {
		return  true;
	} else {
		return  false;
	}
},
```

## 2) Validate CNPJ digits

Given a string validate if it’s a well-formed CNPJ, considering the “check digits” as defined by Receita
Federal.
**Important**: Don’t use a library. You should write the validation code.

```javascript
validDigits:  function (cnpj) {
	if (cnpj.length == 0) return  false;

	// clear string
	cnpj = cnpj.replace(/\D/g,'');

	// Eliminates known invalid CNPJs
if (cnpj == "00000000000000" ||
	cnpj == "11111111111111" ||
	cnpj == "22222222222222" ||
	cnpj == "33333333333333" ||
	cnpj == "44444444444444" ||
	cnpj == "55555555555555" ||
	cnpj == "66666666666666" ||
	cnpj == "77777777777777" ||
	cnpj == "88888888888888" ||
	cnpj == "99999999999999")
	return  false;

	// Check DVs

	vsize = cnpj.length - 2
	vnumber = cnpj.substring(0,vsize);
	vdigits = cnpj.substring(vsize);
	vsum = 0;
	pos = vsize - 7;

	for (i = vsize; i >= 1; i--) {
		vsum += vnumber.charAt(vsize - i) * pos--;
		if (pos < 2) pos = 9;
	}
	vresult = vsum % 11 < 2 ? 0 : 11 - vsum % 11;
	if (vresult != vdigits.charAt(0))
		return  false;

	vsize = vsize + 1;
	vnumber = cnpj.substring(0,vsize);
	vsum = 0;
	pos = vsize - 7;

	for (i = vsize; i >= 1; i--) {
		vsum += vnumber.charAt(vsize - i) * pos--;
		if (pos < 2) pos = 9;
	}

	vresult = vsum % 11 < 2 ? 0 : 11 - vsum % 11;
	if (vresult != vdigits.charAt(1))
		return  false;

	return  true;
},
```

## 3) Test if two rectangles intersect

Considering two rectangles in a discrete grid (like pixels in a display), each defined by two points, return
true if they intersect, false otherwise.
**Note**: _the points are **included** in the rectangle and have a dimension of 1 unit; the rectangle (0, 0; 1, 1) have an area of 4 units._

```javascript
// check intersection
intersects:  function(a, b) {
	if (Math.max(a.left, b.left) < Math.min(a.right, b.right) &&
			Math.max(a.top, b.top) < Math.min(a.bottom, b.bottom)) {
		return  true;
	} else {
		return  false;
	}
},
```

## 4) Compute area of intersection between two rectangles

Considering two rectangles in a discrete grid (like pixels in a display), each defined by two points, compute
the area of intersection between the two.
**Note**: _the points are **included** in the rectangle and have a dimension of 1 unit; the rectangle (0, 0; 1, 1) have an area of 4 units._

```javascript
 	//create rectangle
	createRect: function (rect) {
		ymax = Math.max(rect[0][1], rect[1][1]);
		ymin = Math.min(rect[0][1], rect[1][1]);
		xmax = Math.max(rect[0][0], rect[1][0]);
		xmin = Math.min(rect[0][0], rect[1][0]);

		width = 0;
		height = 0;
		result = [];

		width = (xmax + 1) - xmin;
		height = (ymax + 1) - ymin;
		area = width * height;

		yinitial = ymin;
		vfinalLoop = (area + xmin);

		for (i = xmin; i < vfinalLoop; i++) {
			if (ymin == ymax + 1) {
				xmin++;
				ymin = yinitial;
			}
			result.push([xmin, ymin++]);
		}

		return result;
	},

	// check intersection
	intersects: function (a, b) {
		let rect1 = this.createRect(a);
		let rect2 = this.createRect(b);

		let intersection = [];
		rect1.filter(function (x) {
			rect2.filter(function (y) {

				if (x === y) {
					return true;
				}
				if (x == null || y == null) return false;
				if (x.length !== y.length) return false;

				for (var i = 0; i < x.length; ++i) {
					if (x[i] !== y[i]) return false;
				}
				intersection.push([x]);
				//return true;


			});
		});

		if (intersection.length > 0) {
			this.messageIntersects = 'Intersetcs RectA x RectB is true';
			// area rectangle
			this.areaIntersects = intersection.length;
			return true;
		} else {
			this.messageIntersects = 'Intersetcs RectA x RectB is false';
			this.areaIntersects = 0;
			return false;
		}
	},
```

## 5) Simple Todo List

Todo list application that permits the creation and deletion of tasks (texts).

- The application must persist the tasks between executions;
- Use any storage you want: database, files, PaaS backends (Firebase, etc.);

```javascript
// add task
addTask:  function() {
	this.taskExists = false;
	const  taskNew = this.tasks.filter(task => task.name.toLowerCase() ==
			this.nameTask.toLowerCase()).length == 0;
	if (taskNew) {
		this.tasks.push({
			name:  this.nameTask,
			pending:  true
		});
		this.nameTask = '';
		this.taskExists = false;
	} else {
		this.taskExists = true;
	}
},

//delete task
removeTask:  function(i) {
	this.tasks.splice(i, 1);
},

// task done or pending
toggleTask:  function(i) {
	this.tasks[i].pending = !this.tasks[i].pending;
},
```

## 6) Rest Client - World Clock

Application that queries a server and displays the current date/time hour in local and UTC timezones.

Server URL: http://worldclockapi.com/api/json/utc/now

```javascript
getDateTimeFromAPI:  function() {
	axios.get('http://worldclockapi.com/api/json/utc/now').then(response  => {
		this.currentDateTime = response.data.currentDateTime;
		}).catch(error  => {
			console.log(error);
			this.errored = true
		}).finally(() =>  this.loading = false);
	},

	// format datetime
	format_date:  function(value){
		if (value) {
		return  moment(String(value)).format('DD/MM/YYYY HH:mm', "America/Brasilia");
		}
	},
```

## 7) Rest Server - World Clock

REST server returning a JSON like:

```json
{
  "currentDateTime": "2019­-08-­12T14:40Z"
}
```

The code exercise is inside the clock_api folder and deploy and is running on heroku to view the output:

https://api-test-kaffa.herokuapp.com/date/now

## 8) Entity Relationship Diagram - Simple Order Manager

Design the model of a simple Order Manager System.
The system consists of:

- Clients
- Products
- Orders
- Any other tables you may need

You can draw, describe, or list the tables as SQL.
Extras:

- SQL: list ORDERS with number of items
- Which indexes should be created in this model?
  **Important**: this exercise is documentation only - there’s no executable to run in this case.

  As an example, sqlite was used.

  ```sql

  CREATE TABLE "clients" (
  	"id"	INTEGER PRIMARY KEY AUTOINCREMENT,
  	"name"	TEXT,
  	"email"	TEXT
  );

  CREATE TABLE "orders" (
  	"id"	INTEGER PRIMARY KEY AUTOINCREMENT,
  	"date"	TEXT,
  	"client_id"	integer,
  	FOREIGN KEY("client_id") REFERENCES "clients"("id")
  );

  CREATE TABLE "products" (
  	"id"	INTEGER PRIMARY KEY AUTOINCREMENT,
  	"name"	TEXT,
  	"price"	NUMERIC
  );

  CREATE TABLE "items" (
  	"id"	INTEGER PRIMARY KEY AUTOINCREMENT,
  	"quantity"	INTEGER,
  	"product_id"	integer,
  	"order_id"	integer,
  	FOREIGN KEY("order_id") REFERENCES "orders"("id"),
  	FOREIGN KEY("product_id") REFERENCES "products"("id")
  );

  ```

  SQL list orders with number of items:

  ```sql
  select o.id as order_number, c.name as client_name, count(*) as total_items,
  		sum(p.price * i.quantity) as total_price
  from clients c join orders o on c.id = o.client_id join items i on i.order_id = o.id
  		join products p on i.product_id = p.id
  group by i.order_id, c.name;
  ```
