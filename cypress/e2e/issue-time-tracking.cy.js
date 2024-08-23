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

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
  const getTrackingModal = () => cy.get('[data-testid="modal:tracking"]');
  const Stopwatch = '[data-testid="icon:stopwatch"]';
  const buttonClose = '[data-testid="icon:close"]';
  const backloglist = '[data-testid="board-list:backlog"]';
  let TimeEnter = 'input[placeholder="Number"]';

  it("Should log time and remove logged time succsessfully", () => {
    //add estimation time to issue
    getIssueDetailsModal().within(() => {
      cy.get(Stopwatch).click();
    });
    getTrackingModal()
      .should("be.visible")
      .within(() => {
        cy.get(TimeEnter).first().type(2);
        cy.get(TimeEnter).last().type(5);
        cy.contains("button", "Done").click();
      });

    cy.contains("No time logged").should("not.exist");
    cy.contains("2h logged").should("be.visible");
    cy.contains("5h remaining").should("be.visible");

    //delete time tracking data
    cy.get(Stopwatch).click();
    getTrackingModal()
      .should("be.visible")
      .within(() => {
        cy.get(TimeEnter).first().clear();
        cy.get(TimeEnter).last().clear();
        cy.contains("button", "Done").click();
      });
    //assert that time time tracking data is not visible
    cy.contains("2h logged").should("not.exist");
    cy.contains("5h remaining").should("not.exist");
    cy.contains("No time logged").should("be.visible");
    cy.get("body").type("{esc}");
  });
});
