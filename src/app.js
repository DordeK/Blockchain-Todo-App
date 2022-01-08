app = {
    contract:{},
    loading: false,
    load: async () => {
       await app.loadWeb3()
       await app.loadAccount()
       await app.getContract()
       await app.render()
    },
    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
          app.web3Provider = web3.currentProvider
          web3 = new Web3(web3.currentProvider)
        } else {
          window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
          window.web3 = new Web3(ethereum)
          try {
            // Request account access if needed
            await ethereum.enable()
            // Acccounts now exposed
            web3.eth.sendTransaction({/* ... */})
          } catch (error) {
            // User denied account access...
          }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          App.web3Provider = web3.currentProvider
          window.web3 = new Web3(web3.currentProvider)
          // Acccounts always exposed
          web3.eth.sendTransaction({/* ... */})
        }
        // Non-dapp browsers...
        else {
          console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      },
    loadAccount: async () => {
        app.account = web3.eth.accounts.currentProvider.selectedAddress
    },
    getContract: async () => {
        const todos = await $.getJSON('TodoList.json')
        app.contract.TodoList = TruffleContract(todos)
        app.contract.TodoList.setProvider(app.web3Provider)
        app.todoList = await app.contract.TodoList.deployed()
    },
    render: async () => {
        if(app.loading){
            return
        }

        app.setLoading(true);

        $('#account').html(app.account)
        await app.renderTasks()
        app.setLoading(false);
    },
    setLoading: async (boolean) => {
        app.loading = boolean;
        const loader = $('#loader')
        const content = $('#content')
        if(boolean){
            loader.show()
            content.hide();
        }else{
            loader.hide();
            content.show()
        }
    },
    renderTasks: async () => {
        const taskCount = Number(await app.todoList.tasksCount());
        const $taskTemplate = $('.taskTemplate')

        console.log(taskCount);
        for (let i = 0; i < taskCount; i++) {
            let {id, context, completed} = await app.todoList.tasks(i)
            id = id.toNumber() 

            const $newTaskTemplate = $taskTemplate.clone()
            
            $newTaskTemplate.find('.content').html(context)
            $newTaskTemplate.find('input')
                            .prop('name', id)
                            .prop('checked', completed)
                            // .on('click', app.toggleCompleted)

            if(completed){
                $('#completedTaskList').append($newTaskTemplate)
            }else{
                $('#taskList').append($newTaskTemplate)
            }
            $newTaskTemplate.show() 
        }
    },
    createTask: async (e) => {
        const newTaskContext = $('#newTask').val()
        await app.todoList.createTask(newTaskContext, {from: app.account})
        window.location.reload()
    },
    checkboxClick: async (e) => {
        const taskId = Number(e.target.name)
        const taskCompleted = e.target.checked

        await app.todoList.completeTask(taskId , taskCompleted, {from: app.account})
        window.location.reload()
    }
}

$(()=>{
    $(window).load(()=>{
        app.load()
    })
})