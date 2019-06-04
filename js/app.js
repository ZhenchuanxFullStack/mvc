/*global jQuery, Handlebars, Router */
jQuery(function ($) {
	'use strict';

	var ENTER_KEY = 13;
	var ESCAPE_KEY = 27;

	var App = {
		init: function () {
      this.todos = [];

			$('.new-todo').on('keyup', this.create.bind(this));
			$('.todo-list')
				.on('change', '.toggle', this.toggle.bind(this))
				.on('click', '.destroy', this.destroy.bind(this))
				.on('dblclick', 'label', this.editingMode.bind(this))
				.on('keyup', '.edit', this.editKeyup.bind(this))
				.on('focusout', '.edit', this.update.bind(this));
			$('.toggle-all').on('change', this.toggleAll.bind(this));
			$('.footer').on('click', '.clear-completed', this.destroyCompleted.bind(this));

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
			//this.todos.push(todo);

			$input.val('');

      this.addTodo(todo);
		},
		toggle: function (e) {
      $(e.target).closest('li').toggleClass('completed')
      if (!e.target.checked) {
        this.countIncrease()
      } else {
        this.countDecrease()
      }
      // ...
		},
		destroy: function (e) {
      if (!$(e.target).closest('li').find('[type=checkbox]').get(0).checked) {
        this.countDecrease()
      }
      $(e.target).closest('li').remove()
      // ...
		},

		toggleAll: function (e) {
      var checked = $(e.target).prop('checked')
      $('.todo-item').each(function(){
        $(this).find('[type=checkbox]').prop('checked', checked);
      })
      // ...
		},
		destroyCompleted: function () {
      $('.todo-item').each(function(){
        $(this).find('[type=checkbox]').prop('checked', checked);
      })
      // ...
		},

    addTodo: function(todo) {
      var newTodo = $('<li class="todo-item" data-id="'+todo.id+'">')
                .append(
                  $('<div class="view">')
                    .append($('<input class="toggle" type="checkbox">'))
                    .append($('<label>').text(todo.title))
                    .append($('<button class="destroy">'))
                )
                .append($('<input class="edit">').val(todo.title))
      $('.todo-list').append(newTodo);
      this.countIncrease()
    },

    countIncrease: function() {
      $('.todo-count strong').text($('.todo-count strong').text()*1+1)
    },

    countDecrease: function() {
      $('.todo-count strong').text($('.todo-count strong').text()*1-1)
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
				return;
			} else {
        $el.closest('li')
          .removeClass('editing')
          .find('label').text(val)
			}

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
		getActiveTodos: function () {
			return this.todos.filter(function (todo) {
				return !todo.completed;
			});
		},
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
*/
	};

	App.init();
});
