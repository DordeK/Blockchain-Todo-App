const TodoList = artifacts.require("TodoList.sol");


contract('TodoList', async (accounts) =>{
    before( async () => {
        this.todoList = await TodoList.deployed()
    })

    it('deployed successfully', async ()=> {
        const account = await this.todoList.address
        assert.notEqual(account, 0x0)
        assert.notEqual(account, '')
        assert.notEqual(account, null)
        assert.notEqual(account, undefined)
    })

    it('test one task', async () => {
        const taskCount = await this.todoList.tasksCount()
        const task = await this.todoList.tasks(taskCount-1)

        assert.equal(task.id.toNumber(), taskCount.toNumber()-1)
        assert.equal( taskCount.toNumber(), 4)
        assert.equal(task.context, 'clean room')
        assert.equal(task.completed, false)
    })

    it('create new task', async () => {
        const res = await this.todoList.createTask('A new task');
        const taskCount = await this.todoList.tasksCount()
        const event  = res.logs[0].args

        assert.equal( taskCount.toNumber(), 5)
        assert.equal( event.content, 'A new task')
        assert.equal( event.id, 4)
        assert.equal( event.completed, false)

    })


})