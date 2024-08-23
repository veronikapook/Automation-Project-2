// SPRINT 2, ASSIGNMENT 2: ADD AUTOMATION TESTS FOR TIME TRACKING FUNCTIONALITY

// Custom command for setting estimate
Cypress.Commands.add("setEstimate", (value) => {
  cy.get("@estimateInput").clear();
  if (value !== "") {
    cy.get("@estimateInput").type(value);
  }
  cy.get("@estimateInput").should("have.value", value.toString());
});

describe("Time tracking entering, editing, and deleting", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });

    // Create aliases
    cy.get('input[placeholder="Number"]').as("estimateInput");
    cy.get(".sc-rBLzX").as("timeTrackingSection");
  });

  it("Should add, edit, and delete estimation time successfully", () => {
    // Initial state check
    cy.get("@estimateInput").should("have.value", "8");

    // Add estimation
    cy.setEstimate(10);

    // Verify time tracking section after adding
    cy.get("@timeTrackingSection").should(($el) => {
      const text = $el.text();
      expect(text).to.match(/^4h logged10h estimated$/);
    });

    // Close and reopen issue to verify persistence
    cy.get("body").type("{esc}");
    cy.contains("This is an issue of type: Task.").click();
    cy.get("@estimateInput").should("have.value", "10");

    // Edit estimation
    cy.setEstimate(20);

    // Verify time tracking section after editing
    cy.get("@timeTrackingSection").should(($el) => {
      const text = $el.text();
      expect(text).to.match(/^4h logged20h estimated$/);
    });

    // Close and reopen issue to verify persistence of edit
    cy.get("body").type("{esc}");
    cy.contains("This is an issue of type: Task.").click();
    cy.get("@estimateInput").should("have.value", "20");

    // Delete estimation
    cy.setEstimate("");

    // Verify time tracking section after deleting estimation
    cy.get("@timeTrackingSection").should(($el) => {
      const text = $el.text();
      expect(text).to.equal("4h logged");
    });

    // Close and reopen issue to verify persistence of deletion
    cy.get("body").type("{esc}");
    cy.contains("This is an issue of type: Task.").click();

    // Verify that the input field is still empty
    cy.get("@estimateInput").should("have.value", "");

    // Verify time tracking section after reopening
    cy.get("@timeTrackingSection").should(($el) => {
      const text = $el.text();
      expect(text).to.equal("4h logged");
    });
  });

  it.only("Should log time successfully", () => {
    // Set initial estimate
    cy.get(inputFieldTime).type(estimatedTime);
    cy.get(inputFieldTime).should("have.value", estimatedTime);
    cy.contains(`${estimatedTime}${estimatedTimeExpectedText}`).should(
      "be.visible"
    );

    // Log time
    openTimeTrackingAndChangeLoggedTime(loggedTime, remainingTime);

    // Verify time tracking modal is closed
    cy.get(timeTrackingModal).should("not.exist");

    // Verify logged and remaining time are visible, estimated time is not
    validateTime(loggedTime, loggedTimeExpectedText);
    validateTime(remainingTime, remainingTimeExpectedText);
    validateTime(estimatedTime, estimatedTimeExpectedText, false);

    // Verify 'No time logged' is not visible
    validateNoTimeLogged();

    // Close and reopen issue to verify persistence
    cy.get("body").type("{esc}");
    cy.contains("This is an issue of type: Task.").click();

    // Verify logged and remaining time are still visible after reopening
    validateTime(loggedTime, loggedTimeExpectedText);
    validateTime(remainingTime, remainingTimeExpectedText);
  });

  it.only("Should remove logged time successfully", () => {
    // First, log some time
    openTimeTrackingAndChangeLoggedTime(loggedTime, remainingTime);

    // Verify logged time is visible
    validateTime(loggedTime, loggedTimeExpectedText);
    validateTime(remainingTime, remainingTimeExpectedText);

    // Remove logged time
    openTimeTrackingAndChangeLoggedTime(null, null, true);

    // Verify 'No time logged' is visible
    validateNoTimeLogged(true);

    // Verify logged and remaining time are not visible, but estimated time is
    validateTime(loggedTime, loggedTimeExpectedText, false);
    validateTime(remainingTime, remainingTimeExpectedText, false);
    validateTime(estimatedTime, estimatedTimeExpectedText);

    // Close and reopen issue to verify persistence
    cy.get("body").type("{esc}");
    cy.contains("This is an issue of type: Task.").click();

    // Verify 'No time logged' is still visible after reopening
    validateNoTimeLogged(true);
  });

  function openTimeTrackingAndChangeLoggedTime(
    loggedTime,
    remainingTime,
    shouldClearTime = false
  ) {
    cy.get(timeTrackingButton).click();
    cy.get(timeTrackingModal)
      .should("be.visible")
      .within(() => {
        if (shouldClearTime) {
          cy.get(inputFieldTime).eq(0).clear();
          cy.get(inputFieldTime).eq(1).clear();
        } else {
          cy.get(inputFieldTime).eq(0).type(loggedTime);
          cy.get(inputFieldTime).eq(1).type(remainingTime);
        }

        cy.contains("button", "Done").click();
      });
  }

  function validateTime(
    timeValue,
    remainingPartOfString,
    shouldBeVisible = true
  ) {
    if (shouldBeVisible) {
      cy.contains(`${timeValue}${remainingPartOfString}`).should("be.visible");
    } else {
      cy.contains(`${timeValue}${remainingPartOfString}`).should("not.exist");
    }
  }

  function validateNoTimeLogged(shouldShowNoTimeLogged = false) {
    if (shouldShowNoTimeLogged) {
      cy.contains("No time logged").should("be.visible");
    } else {
      cy.contains("No time logged").should("not.exist");
    }
  }
});
