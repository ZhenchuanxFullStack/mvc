/*global jQuery, Handlebars, Router */
jQuery(function ($) {
	'use strict';

	var ENTER_KEY = 13;
	var ESCAPE_KEY = 27;

  Handlebars.registerHelper('eq', function (a, b, options) {
		return a === b ? options.fn(this) : options.inverse(this);
	});


	var App = {
		init: function () {
      this.todos = util.store('todos-jquery');
      var self = this;

			$('.new-todo').on('keyup', this.create.bind(this));
			$('.todo-list')
				.on('change', '.toggle', this.toggle.bind(this))
				.on('click', '.destroy', this.destroy.bind(this))
				.on('dblclick', 'label', this.editingMode.bind(this))
				.on('keyup', '.edit', this.editKeyup.bind(this))
				.on('focusout', '.edit', this.update.bind(this));
			$('.toggle-all').on('change', this.toggleAll.bind(this));
			$('.footer').on('click', '.clear-completed', this.destroyCompleted.bind(this));


			this.todoTemplate = Handlebars.compile($('#todo-template').html());
			this.footerTemplate = Handlebars.compile($('#footer-template').html());
      this.render();
		},
    render: function () {
      $('.todo-list').html(this.todoTemplate(this.todos));
      util.store('todos-jquery', this.todos);

      var todoCount = this.todos.length;
      var activeTodoCount = this.getActiveTodos().length;
      var template = this.footerTemplate({
        activeTodoCount: activeTodoCount,
        activeTodoWord: util.pluralize(activeTodoCount, 'item'),
        completedTodos: todoCount - activeTodoCount,
        filter: this.filter
      });
      $('.footer').toggle(todoCount > 0).html(template);
    },
		create: function (e) {
			var $input = $(e.target);
			var val = $input.val().trim();

			if (e.which !== ENTER_KEY || !val) {
				return;
			}

			var todo = {
				id: util.uuid(),
				title: val,
				completed: false
			};
			this.todos.push(todo);

			$input.val('');

      this.render();
		},
		toggle: function (e) {
      var i = this.getIndexFromEl(e.target)
      this.todos[i].completed = !this.todos[i].completed
      this.render();
      // ...
		},
		destroy: function (e) {
      var i = this.getIndexFromEl(e.target)
      this.todos.splice(i,1)
      this.render();
		},

		toggleAll: function (e) {
      var checked = $(e.target).prop('checked')
      this.todos.forEach(function(todo){
        todo.completed = checked
      })
      this.render();
      // ...
		},
		destroyCompleted: function () {
      this.todos.forEach(function(todo, i){
        if (todo.completed) this.todos.splice(i, 1)
      })
      this.render();
		},

		editingMode: function (e) {
			var $input = $(e.target).closest('li').addClass('editing').find('.edit');
			// puts caret at end of input
			var tmpStr = $input.val();
			$input.val('');
			$input.val(tmpStr);
			$input.focus();
		},
		editKeyup: function (e) {
			if (e.which === ENTER_KEY) {
				e.target.blur();
			}

			if (e.which === ESCAPE_KEY) {
				$(e.target).data('abort', true).blur();
			}
		},
		update: function (e) {
			var el = e.target;
			var $el = $(el);
			var val = $el.val().trim();
			
			if ($el.data('abort')) {
				$el.data('abort', false);

			} else if (!val) {
				this.destroy(e);

			} else {

        var i = this.getIndexFromEl(e.target)
        this.todos[i].title = val

        this.render()
			}
		},
		getActiveTodos: function () {
			return this.todos.filter(function (todo) {
				return !todo.completed;
			});
		},

    /*





		render: function () {
			var todos = this.getFilteredTodos();
			$('.todo-list').html(this.todoTemplate(todos));
			$('.main').toggle(todos.length > 0);
			$('.toggle-all').prop('checked', this.getActiveTodos().length === 0);
			this.renderFooter();
			$('.new-todo').focus();
			util.store('todos-jquery', this.todos);
		},
		renderFooter: function () {
			var todoCount = this.todos.length;
			var activeTodoCount = this.getActiveTodos().length;
			var template = this.footerTemplate({
				activeTodoCount: activeTodoCount,
				activeTodoWord: util.pluralize(activeTodoCount, 'item'),
				completedTodos: todoCount - activeTodoCount,
				filter: this.filter
			});

			$('.footer').toggle(todoCount > 0).html(template);
		},
    // Filters
		getCompletedTodos: function () {
			return this.todos.filter(function (todo) {
				return todo.completed;
			});
		},
		getFilteredTodos: function () {
			if (this.filter === 'active') {
				return this.getActiveTodos();
			}

			if (this.filter === 'completed') {
				return this.getCompletedTodos();
			}

			return this.todos;
		},
*/
		// accepts an element from inside the `.item` div and
		// returns the corresponding index in the `todos` array
		getIndexFromEl: function (el) {
			var id = $(el).closest('li').data('id');
			var todos = this.todos;
			var i = todos.length;

			while (i--) {
				if (todos[i].id === id) {
					return i;
				}
			}
		}
	};

	App.init();
});
