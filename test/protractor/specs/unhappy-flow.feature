Feature: Todo application
  As a person who likes to use stickies
  I want a webbased todo list
  Which show me all my todos

  Scenario: The api response for fetching the todos is not ok
    Given an error occurred while fetching the todos

  Scenario Outline: Verify information
    Then the total number of todos is <numberOfTodos>
    And the total number of remaining uncompleted todos is <numberOfUncompletedTodos>
    And the total number of completed but unarchived todos is <numberOfUnarchivedTodos>
    Examples:
      | numberOfTodos | numberOfUncompletedTodos | numberOfUnarchivedTodos |
      | 0             | 0                        | 0                       |


  Scenario: The api response for adding a todo is not ok
    Given an error occurred while adding a todo
    When I add the todo

  Scenario Outline: Verify information
    Then the total number of todos is <numberOfTodos>
    And the total number of remaining uncompleted todos is <numberOfUncompletedTodos>
    And the total number of completed but unarchived todos is <numberOfUnarchivedTodos>
    Examples:
      | numberOfTodos | numberOfUncompletedTodos | numberOfUnarchivedTodos |
      | 3             | 2                        | 1                       |


  Scenario: The api response for archiving a todo is not ok
    Given an error occurred while archiving a todo
    When I archive the todos

  Scenario Outline: Verify information
    Then the total number of todos is <numberOfTodos>
    And the total number of remaining uncompleted todos is <numberOfUncompletedTodos>
    And the total number of completed but unarchived todos is <numberOfUnarchivedTodos>
    Examples:
      | numberOfTodos | numberOfUncompletedTodos | numberOfUnarchivedTodos |
      | 3             | 2                        | 1                       |


  Scenario: The api response for marking a todo as completed is not ok
    Given an error occurred while completing a todo
    When I check the todo as completed

  Scenario Outline: Verify information
    Then the total number of todos is <numberOfTodos>
    And the total number of remaining uncompleted todos is <numberOfUncompletedTodos>
    And the total number of completed but unarchived todos is <numberOfUnarchivedTodos>
    Examples:
      | numberOfTodos | numberOfUncompletedTodos | numberOfUnarchivedTodos |
      | 3             | 2                        | 1                       |
