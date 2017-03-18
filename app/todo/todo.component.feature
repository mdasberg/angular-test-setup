Feature: The todo component
  Allows a person to
  - view all the available todos
  - add a todo
  - mark a todo as completed
  - archive completed todos

  Scenario: Verify start state
    Given there are todos in my todo list
    Then the number of available todos is 3
    And the number of uncompleted todos is 2
    And the following todos are available:
      | index | description            | completed |
      | 0     | do something           | false     |
      | 1     | do something else      | true      |
      | 2     | do something different | false     |

  Scenario: Add a todo
    Then the number of available todos is 3
    And the number of uncompleted todos is 2
    And the following todos are available:
      | index | description            | completed |
      | 0     | do something           | false     |
      | 1     | do something else      | true      |
      | 2     | do something different | false     |
    When a todo is added
    Then the number of available todos is 4
    And the number of uncompleted todos is 3
    And the following todos are available:
      | index | description            | completed |
      | 0     | do something           | false     |
      | 1     | do something else      | true      |
      | 2     | do something different | false     |
      | 3     | another todo           | false     |

  Scenario: Archive completed todos
    Then the number of available todos is 4
    And the number of uncompleted todos is 3
    And the following todos are available:
      | index | description            | completed |
      | 0     | do something           | false     |
      | 1     | do something else      | true      |
      | 2     | do something different | false     |
    When the completed todos are archived
    Then the number of available todos is 3
    And the number of uncompleted todos is 3
    And the following todos are available:
      | index | description            | completed |
      | 0     | do something           | false     |
      | 1     | do something different | false     |
      | 2     | another todo           | false     |

  Scenario: Complete a todo
    Then the number of available todos is 3
    And the number of uncompleted todos is 3
    And the following todos are available:
      | index | description            | completed |
      | 0     | do something           | false     |
      | 1     | do something different | false     |
      | 2     | another todo           | false     |
    When a todo is completed
    Then the number of available todos is 3
    And the number of uncompleted todos is 2
    And the following todos are available:
      | index | description            | completed |
      | 0     | do something           | false     |
      | 1     | do something different | false     |
      | 2     | another todo           | true     |

