Feature: Todo application
  As a person who likes to use stickies
  I want a webbased todo list
  Which show me all my todos

  Scenario: There are uncompleted and unarchived todos available
    Given I have todos

  Scenario Outline: Verify information
    Then the total number of todos is <numberOfTodos>
    And the total number of remaining uncompleted todos is <numberOfUncompletedTodos>
    Examples:
      | numberOfTodos | numberOfUncompletedTodos |
      | 3             | 2                        |

  Scenario Outline: Verify available todos
    Then todo <index> with description <description> should be present
    And todo <index> should be marked as completed <completed>
    Examples:
      | index | description            | completed |
      | 0     | do something           | false     |
      | 1     | do something else      | true      |
      | 2     | do something different | false     |


  Scenario: There is a new todo that needs to be added
    Given I have new todo
    When I add the todo

  Scenario Outline: Verify information
    Then the total number of todos is <numberOfTodos>
    And the total number of remaining uncompleted todos is <numberOfUncompletedTodos>
    Examples:
      | numberOfTodos | numberOfUncompletedTodos |
      | 4             | 3                        |

  Scenario Outline: Verify available todos
    Then todo <index> with description <description> should be present
    And todo <index> should be marked as completed <completed>
    Examples:
      | index | description            | completed |
      | 0     | do something           | false     |
      | 1     | do something else      | true      |
      | 2     | do something different | false     |
      | 3     | another todo           | false     |


  Scenario: There are items that can be archived
    Given I have completed todos that has not been archived yet
    When I archive the todos

  Scenario Outline: Verify information
    Then the total number of todos is <numberOfTodos>
    And the total number of remaining uncompleted todos is <numberOfUncompletedTodos>
    Examples:
      | numberOfTodos | numberOfUncompletedTodos |
      | 3             | 3                        |

  Scenario Outline: Verify available todos
    Then todo <index> with description <description> should be present
    And todo <index> should be marked as completed <completed>
    Examples:
      | index | description            | completed |
      | 0     | do something           | false     |
      | 1     | do something different | false     |
      | 2     | another todo           | false     |


  Scenario: There is a todo that is completed
    Given I have completed a todo
    When I check the todo as completed

  Scenario Outline: Verify information
    Then the total number of todos is <numberOfTodos>
    And the total number of remaining uncompleted todos is <numberOfUncompletedTodos>
    Examples:
      | numberOfTodos | numberOfUncompletedTodos |
      | 3             | 2                        |

  Scenario Outline: Verify available todos
    Then todo <index> with description <description> should be present
    And todo <index> should be marked as completed <completed>
    Examples:
      | index | description            | completed |
      | 0     | do something           | false     |
      | 1     | do something different | false     |
      | 2     | another todo           | true      |