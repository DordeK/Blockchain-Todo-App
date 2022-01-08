pragma solidity ^0.5.0;

contract TodoList {
    uint256 public tasksCount = 0;

    constructor() public {
        createTask("do this");
        createTask("do that");
        createTask("do dishes");
        createTask("clean room");
    }

    struct Task {
        uint256 id;
        string context;
        bool completed;
    }

    // like array
    mapping(uint256 => Task) public tasks;
    event TaskCreated(uint256 id, string content, bool completed);

    function createTask(string memory _context) public {
        tasks[tasksCount] = Task(tasksCount, _context, false);
        emit TaskCreated(tasksCount, _context, false);
        tasksCount++;
    }

    function completeTask(uint256 id, bool completed) public {
        tasks[id] = Task(id, tasks[id].context, completed);
    }
}
