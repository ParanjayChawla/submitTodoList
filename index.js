//design pattern
//readable, maintainable, debuggable
//MVC/MVVM, model(data) view(element) controller(eventlistener, logic), model view viewmodel
//template(html), controller(javascript),css(), DOM api(window.document),

//closure, IIFE(immediately invoked function expression)

/* const model = (() => {
    let counter = 0;
    const increment = () => {
        counter++
        return counter
    };
    return {
        increment,
    };
})();

console.log(model.increment());
console.log(model.increment()); */

//table, rows, columns, id(uuid(universally unique identifier), uid)

/*

    get(id optionally): read
    post: write
    put(id): update, replace
    patch(id): update, partial replace
    delete(id): remove a row
*/

const APIs = (() => {
    const URL = "http://localhost:3000/todos";

    const addTodo = (newTodo) => {
        // post
        return fetch(URL, {
            method: "POST",
            body: JSON.stringify(newTodo),
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.json());
    };

    const removeTodo = (id) => {
        return fetch(URL + `/${id}`, {
            method: "DELETE",
        }).then((res) => res.json());
    };

    const getTodos = () => {
        return fetch(URL).then((res) => res.json());
    };

    const editTodos = (editTodo,id) => {
        return fetch(`${URL}/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                title: editTodo,
                completion: 0,
                id: id,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json());
    };

    const ToggleCompletion = (bin, id, title) => {

        if (+bin === +1) {
            console.log("num - 1 ")
            return fetch(`${URL}/${id}`, {
                method: "PUT",
                body: JSON.stringify({
                    title,
                    completion: 0,
                    id:id,
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            ).then((res)=> res.json());
        } else {
            console.log("num - 0 ")
            return fetch(`${URL}/${id}`, {
                method: "PUT",
                body: JSON.stringify({
                    title,
                    completion: 1,
                    id:id,
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            ).then((res)=> res.json());
        }


    }


    return {
        addTodo,
        removeTodo,
        getTodos,
        editTodos,
        ToggleCompletion
    };
})();

const Model = (() => {
    //todolist
    class State {
        #todos; //[{id: ,title: },{}]
        #onChange;
        constructor() {
            this.#todos = [];
        }

        get todos() {
            return this.#todos;
        }

        set todos(newTodo) {
            console.log("setter");
            this.#todos = newTodo;
            //const obj = {name:"adam"};
            //obj.age //undefined
            //obj.age(); //error
            this.#onChange?.();
        }

        subscribe(callback) {
            this.#onChange = callback;
        }
    }
    let { getTodos, removeTodo, addTodo } = APIs;

    return {
        State,
        getTodos,
        removeTodo,
        addTodo,
    };
})();
//BEM, block element modifier methodology
const View = (() => {
    const formEl = document.querySelector(".form"); //querying
    const todoListEl = document.querySelector(".todo-list");
    const updateTodoList = (todos) => {
        let template = "";
        todos.forEach((todo) => {
            const todoTemplate = `<li id="${todo.id}" class="list-item" ><span class="span-c" id="${todo.id}">${todo.title}</span><button class="btn--edit" id="${todo.id}">edit</button><button class="btn--delete" id="${todo.id}">remove</button></li>`;
            // const todoTemplate = `<li><input type="text" value="${todo.title}"><button class="btn--edit" id="${todo.id}">edit</button><button class="btn--delete" id="${todo.id}">remove</button></li>`;
            template += todoTemplate;
        });
        if(todos.length === 0){
            template = "no task to display"
        }
        todoListEl.innerHTML = template;
    };

    const changetodoTemplate = (todos, id) => {
        let template = "";
        todos.forEach((todo) => {

            if (+id === +todo.id){
                const todoTemplate = `<li><input id="editText" type="text" value="${todo.title}"><button class="btn--edit-submit" id="${todo.id}">submit</button><button class="btn--delete" id="${todo.id}">remove</button></li>`;
                template += todoTemplate;
            } else {
                const todoTemplate = `<li id="${todo.id}" class="list-item"><span class="span-c" id="${todo.id}">${todo.title}</span><button class="btn--edit" id="${todo.id}">edit</button><button class="btn--delete" id="${todo.id}">remove</button></li>`;
                template += todoTemplate;
            }
        });
        todoListEl.innerHTML = template;
    }
    const changebacktoOriginalTemplate = (todos, id, title) => {
        let template = "";
        todos.forEach((todo) => {

            if (+id === +todo.id){
                const todoTemplate = `<li id="${todo.id}" class="list-item"><span class="span-c" id="${todo.id}">${title}</span><button class="btn--edit" id="${todo.id}">edit</button><button class="btn--delete" id="${todo.id}">remove</button></li>`;
                template += todoTemplate;

            } else {
                const todoTemplate = `<li id="${todo.id}" class="list-item"><span class="span-c" id="${todo.id}">${todo.title}</span><button class="btn--edit" id="${todo.id}">edit</button><button class="btn--delete" id="${todo.id}">remove</button></li>`;
                template += todoTemplate;

            }
        });
        todoListEl.innerHTML = template;
    }
    const changetostrikeThrough = (todos,id) => {
        let template = "";
        todos.forEach((todo) => {

            if (+todo.completion === +1) {
                const todoTemplate = `<li id="${todo.id}" class="list-item"><span class="span-c" STYLE="text-decoration: line-through" id="${todo.id}">${todo.title}</span><button class="btn--edit" id="${todo.id}">edit</button><button class="btn--delete" id="${todo.id}">remove</button></li>`;
                template += todoTemplate;
            }


            else {
                const todoTemplate = `<li id="${todo.id}" class="list-item"><span class="span-c" id="${todo.id}">${todo.title}</span><button class="btn--edit" id="${todo.id}">edit</button><button class="btn--delete" id="${todo.id}">remove</button></li>`;
                template += todoTemplate;

            }
        });
        todoListEl.innerHTML = template;
    }
    const moveToBottom = (todos) => {
        let c_todo = [];
        let template = "";
        todos.forEach((todo) => {
            if (+todo.completion === +1){
                savedTodo = todo
                c_todo= [...c_todo,todo];
            } else {
                const todoTemplate = `<li id="${todo.id}" class="list-item"><span class="span-c" id="${todo.id}">${todo.title}</span><button class="btn--edit" id="${todo.id}">edit</button><button class="btn--delete" id="${todo.id}">remove</button></li>`;
                template += todoTemplate;
            }

        })
        if (c_todo.length >0){
            template += `<div  STYLE="height: 100px"></div>`

        }

        c_todo.forEach((todo)=>{
            const todoTemplate = `<li id="${todo.id}" class="list-item"><span class="span-c" STYLE="text-decoration: line-through" id="${todo.id}">${todo.title}</span><button class="btn--edit" id="${todo.id}">edit</button><button class="btn--delete" id="${todo.id}">remove</button></li>`;
            template += todoTemplate;
        })
        todoListEl.innerHTML = template;
    }
    return {
        formEl,
        todoListEl,
        updateTodoList,
        changetodoTemplate,
        changebacktoOriginalTemplate,
        changetostrikeThrough,
        moveToBottom
    };
})();

//reference: pointer
//window.console.log

//

/*
    prevent the refresh
    get the value from input
    save the new task to the database(could fail)
    save new task object to state, update the page


*/

const ViewModel = ((View, Model) => {
    console.log("model", Model);
    const state = new Model.State();

    const getTodos = () => {
        Model.getTodos().then((res) => {
            state.todos = res;
        });
    };

    const addTodo = () => {
        View.formEl.addEventListener("submit", (event) => {
            event.preventDefault();
            const title = event.target[0].value;
            console.log(event.target)

            if(title.trim() === "") {
                alert("please input title!");
                return;
            }
            const newTodo = { title: title,
            completion: 0
            };
            Model.addTodo(newTodo)
                .then((res) => {
                    state.todos = [res, ...state.todos];
                    event.target[0].value = ""
                })
                .catch((err) => {
                    alert(`add new task failed: ${err}`);
                });
        });
    };
    // 1. press edit
    // 2. the label turns into a textbox
    // 3. you press submit where edit was
    // 4. the text is replaced.
    //  4a. the text is deleted at id and put at id
    const editTodo = () => {
        View.todoListEl.addEventListener("click",(event)=>{
            const id = event.target.id;
            let savedTodo;
            if (event.target.className === "btn--edit"){
                // console.log(+id)
                View.changetodoTemplate(state.todos,+id)
                // console.log(state.todos)

            }
            if (event.target.className === "btn--edit-submit"){
                // console.log(event.target);
                const title = document.getElementById('editText').value
                // (edit)state(save) -> db(post)
                View.changebacktoOriginalTemplate(state.todos,+id,title)
                APIs.editTodos(title, id).then((res)=>{
                    // Find the todo to replace
                    state.todos.forEach((todo)=>{
                        if (+todo.id === +id){
                            savedTodo = todo
                        }
                    })
                    //  Replace it and check
                    let ind = state.todos.indexOf(savedTodo);
                    state.todos[ind] = res
                    // console.log(state.todos)
                });

            }
        })
    };

    const updateTodo = () => {
        View.todoListEl.addEventListener("click",(event)=>{
            const id = event.target.id;
            let newTodoTitle = "";
            let savedTodo;
            // ignoring other buttons
            if (event.target.className === "btn--edit"){
                return
            }
            if (event.target.className === "btn--edit-submit"){
                return
            }
            if(event.target.className === "btn--delete"){
                return
            }
            if(event.target.id === "editText"){
                return
            }
            if(event.target.className === "span-c"){
                // console.log(event.target.innerText)
                // Get title
                console.log(state.todos)
                state.todos.forEach((todo)=>{
                    if (+todo.id === +id){
                        savedTodo = todo
                    }
                })
                const title = event.target.innerText;
                APIs.ToggleCompletion(+savedTodo.completion,id,title).then((res)=>{
                    console.log(res);
                    let ind = state.todos.indexOf(savedTodo);
                    state.todos[ind]  = res;
                    View.changetostrikeThrough(state.todos,id);
                    View.moveToBottom(state.todos);
                })

                // newTodoTitle = title
            }


            // Model.getTodos().then((res)=>{
            //     state.todos = res
            // })



        })
    }


    const removeTodo = () => {
        //event bubbling: event listener from parent element can receive event emitted from its child
        View.todoListEl.addEventListener("click",(event)=>{
            //console.log(event.target/* emit the event */, event.currentTarget/* receive the event */);
            const id = event.target.id;
            //console.log("id", id)
            if(event.target.className === "btn--delete"){
                Model.removeTodo(id).then(res=>{
                    state.todos = state.todos.filter(todo=> +todo.id !== +id)
                }).catch(err=>alert(`delete todo failed: ${err}`))
            }
            // everytime edit is clicked this happens
            //

        })
    };

    const bootstrap = () => {
        addTodo();
        getTodos();
        removeTodo();
        editTodo();
        updateTodo();
        state.subscribe(() => {
            console.log(state.todos);
            // View.updateTodoList(state.todos);
            View.changetostrikeThrough(state.todos);
            View.moveToBottom(state.todos);
        });
    };

    return {
        bootstrap,
    };
})(View, Model);

ViewModel.bootstrap();


// const editTodos = (editTodo) => {
//         return fetch(`${URL}/${id}`, {
//             method: "PATCH",
//             body: JSON.stringify(editTodo),
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         })
//     }