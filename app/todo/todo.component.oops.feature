Feature: The todo component
  Should not bother the user with exceptions

  Scenario: The api response for fetching the todos is not ok
    Given the todo service throws an error while fetching the available todos
    Then the number of available todos is 0
    And the number of uncompleted todos is 0
    Then the error 'An error occurred when fetching available todos' is shown

  Scenario: The api response for adding a todo is not ok
    Given there are todos in my todo list
    When a todo is added the todo service throws an error
    Then the error 'An error occurred when adding a todo' is shown

  Scenario: The api response for archiving a todo is not ok
    Given there are todos in my todo list
    When the completed todos are archived the todo service throws an error
    Then the error 'An error occurred when archiving completed todos' is shown

  Scenario: The api response for completing a todo is not ok
    Given there are todos in my todo list
    When a todo is completed the todo service throws an error
    Then the error 'An error occurred when completing a todo' is shown

