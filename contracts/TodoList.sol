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

    mapping(uint256 => Task) public tasks;

    function createTask(string memory _context) public {
        tasks[tasksCount] = Task(tasksCount, _context, false);
        tasksCount++;
    }
}
