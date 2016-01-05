Feature: Todo application
  As a person who likes to use stickies
  I want a webbased todo list
  Which show me all my todos

  Scenario: There are uncompleted and unarchived todos available
    Given I have todos
    Then They should be visible
    And the total number of todos is visible
    And the total number of remaining uncompleted todos is visible

  Scenario: There is a new todo that needs to be added
    Given I have new todo
    When I add the todo
    Then it should be added to the list
    And the total number of todos should be updated
    And the total number of remaining uncompleted todos should be updated

  Scenario: There are items that can be archived
    Given I have completed todos that has not been archived yet
    When I archive the todos
    Then they should be removed from the list
    And the total number of todos should be updated
    And the total number of remaining uncompleted todos should be unchanged
    And the total number of completed but unarchived todos should be updated

  Scenario: There is a todo that is completed
    Given I have completed a todo
    When I check the todo as completed
    Then it should be marked as completed
    And the total number of remaining uncompleted todos should be updated
    And the total number of completed but unarchived todos should be updated