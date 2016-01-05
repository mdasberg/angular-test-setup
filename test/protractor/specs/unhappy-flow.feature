Feature: Todo application
  As a person who likes to use stickies
  I want a webbased todo list
  Which show me all my todos

  Scenario: The api response for fetching the todos is not ok
    Given an error occurred while fetching the todos
    Then the total number of todos should be 0
    And the total number of remaining uncompleted todos should be 0
    And the total number of completed but unarchived todos should be 0

  Scenario: The api response for adding a todo is not ok
    Given an error occurred while adding a todo
    Then the total number of todos should be 0
    And the total number of remaining uncompleted todos should be 0
    And the total number of completed but unarchived todos should be 0

  Scenario: The api response for archiving a todo is not ok
    Given an error occurred while archiving a todo
    Then the total number of todos should not update
    And the total number of remaining uncompleted todos should not be updated
    And the total number of completed but unarchived todos should not be updated

  Scenario: The api response for marking a todo as completed is not ok
    Given an error occurred while completing a todo
    Then the total number of todos should not update
    And the total number of remaining uncompleted todos should not be updated
    And the total number of completed but unarchived todos should not be updated