// tasks section header with search, sort, and add task ui
export function TasksHeader({
    setFilteredTasks,
    searchPhrase,
    setSearchPhrase,
    setToggleAddTask,

  }) {
  
    // sorts tasks by name into filteredTasks
    
      const sortTasks = (prop) => {
        setFilteredTasks((tasks) => {
          let newTasks = [...tasks];
          newTasks.sort((a, b) => {
            const aLower = a.data[prop].toLowerCase();
            const bLower = b.data[prop].toLowerCase();
            if (aLower < bLower) {
              return -1;
            } else if (aLower > bLower) {
              return 1;
            } else {
              return 0;
            }
          });
          return newTasks;
        });
      };
      const sortName = () => {
        sortTasks('name');
      };
      
      const sortStatus = () => {
        sortTasks('status');
      };
      
      const sortDue = () => {
        sortTasks('due');
      };
      
  
    return (
      <div className="tasks__list-header">
        <div className="tasks__search-group">
          <label className="offscreen" htmlFor="search">
            Search Tasks
          </label>
          <input
            type="text"
            id="search"
            name="search"
            key="search"
            onChange={(e) => setSearchPhrase(e.target.value)}
            value={searchPhrase}
          ></input>
        </div>
        <div className="tasks__sort-group">
          <button className="" type="button" onClick={() => sortName()}>
            Name
          </button>
          <button className="" type="button" onClick={() => sortStatus()}>
            Status
          </button>
          <button className="" type="button" onClick={() => sortDue()}>
            Due
          </button>
        </div>
  
        <button
          className="tasks__new-btn"
          type="button"
          onClick={() => setToggleAddTask(true)}
        >
          +
        </button>
      </div>
    );
  }
  
  