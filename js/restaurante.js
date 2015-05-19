var first = [new Article("Arroz caldoso con bogavante", 15), 
			 new Article("Ensalada templada de verduras y quesos", 14),
			 new Article("Ensalada de rape, gambas y setas", 17),
			 new Article("Consomé de crema de nécoras", 9),
			 new Article("Almejas a la marinera", 19),
			 new Article("Sopa de marisco")].sort(compare);

var second = [new Article("Solomillo de ternera", 19),
			  new Article("Entrecot de buey", 16),
			  new Article("Besugo a la espalda", 30),
			  new Article("Rape amariscado", 24),
			  new Article("Lomo de bacalao al horno", 19),
			  new Article("Pulpo de lastres con setas a la crema", 16)].sort(compare);

var desserts = [new Article("Copa de helado de fresa", 3.5),
				new Article("Semifrío de mango con chocolate", 4.5),
				new Article("Pastel de chocolate con crema de limón", 6),
				new Article("Macedonia de frutas y yogurt griego", 5),
			   	new Article("Tarta de sidra a la manzana", 4),
			   	new Article("Flan de chocolate blanco sobre cama de pan con café", 2)].sort(compare);

var extras = {"coffee": 1.2, "cup": 2};

var nTables = 30;
var tables = [];

$(document).ready(function()
{
	loadList($('#meals'), first);
	loadTables(nTables);

	$('#table').click(function()
	{
		getSelectedTable().visit();
	});

	$('#pay').click(function()
	{
		getSelectedTable().makeReady();
		getSelectedTable().visit();
	});

	$('#first').change(function(event)
	{
		if (this.checked)
			loadList($('#meals'), first);
	});

	$('#second').change(function(event)
	{
		if (this.checked)
			loadList($('#meals'), second);
	});

	$('#desserts').change(function(event)
	{
		if (this.checked)
			loadList($('#meals'), desserts);
	});

	$('#meals').dblclick(function(event)
	{
		getSelectedTable().addOrder($('#meals').find(":selected").text(), $('#meals').find(":selected").val());
	});

	$('#order').dblclick(function(event)
	{
		getSelectedTable().removeOrder($('option:selected', this));
	});

	$('#cup').change(function(event)
	{
		if (this.checked)
			getSelectedTable().addExtra("cup");
		else
			getSelectedTable().removeExtra("cup");
	});

	$('#coffee').change(function(event)
	{
		if (this.checked)
			getSelectedTable().addExtra("coffee");
		else
			getSelectedTable().removeExtra("coffee");
	});

	$(window).resize(function()
	{
		$('#container').css(
		{
			position: 'absolute',
			left: ($(window).width() - $('#container').outerWidth())/2,
			top: ($(window).height() - $('#container').outerHeight())/2
		});	
 	});
 
 	$(window).resize();
});

function getSelectedTable()
{
	return tables[parseInt($('#table').find(":selected").val())];
}

function loadList(list, articles)
{
	var items = [];

	if (articles.length > 0)
	{
		articles.forEach(function(article)
		{
			items.push('<option value="'+ article.price +'">'+ article.name +'</option>');
		});

		list.html(items.join(''));
	}
	else
		list.html("");
}

function loadTables(n)
{
	var items = [];

	tables[1] = new Table();
	items.push('<option value="1" selected>Mesa 1</option>');

	for (var i = 2; i <= n; i++)
	{
		tables[i] = new Table();
		items.push('<option value="'+ i +'">'+ "Mesa " + i +'</option>');
	};

	$('#table').html(items.join(''));
}

function Article(name, price)
{
	this.name = name;
	this.price = price;
}

function Table()
{
	this.makeReady = function()
	{
		this.orders = "";
		this.extras = [];
		this.bill = 0;

		for (var extra in extras)
			this.extras[extra] = false;
	}

	this.visit = function()
	{
		this.refreshBill();
		this.refreshOrders();
		this.refreshExtras();
	}

	this.addOrder = function(name, price)
	{
		this.bill += parseFloat(price);
		this.refreshBill();

		$('#order').append('<option value="' + price + '">' + name + '</option>');
		this.orders = $('#order').html();
	}

	this.removeOrder = function(order)
	{
		this.bill -= parseFloat(order.val());
		this.refreshBill();

		order.remove();
		this.orders = $('#order').html();
	}

	this.addExtra = function(name)
	{
		this.extras[name] = true;

		this.bill += parseFloat(extras[name]);
		this.refreshBill();
	}

	this.removeExtra = function(name)
	{
		this.extras[name] = false;

		this.bill -= parseFloat(extras[name]);
		this.refreshBill();
	}

	this.refreshExtras = function()
	{
		for (var extra in extras)
			$('#' + extra).prop('checked', this.extras[extra]);
	}

    this.refreshBill = function()
    {
		$('#total').val(this.bill.toFixed(2));
    }

    this.refreshOrders = function()
    {
    	$('#order').html(this.orders);
	}

    this.makeReady();
}

function compare(a, b)
{
	if (a.name > b.name)
		return 1;
	if (a.name < b.name)
		return -1;
	return 0;
}