// Import the IssueModal class
import IssueModal from "../pages/IssueModal";

// Test suite for issue deletion
describe("Issue deleting", () => {
  // Setup before each test
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
      });
  });

  // Test case for cancelling deletion
  it("Should cancel deletion process successfully and validate", () => {
    // Validate initial issue count
    IssueModal.ensureIssueIsCreated(4, { title: "Dummy", assignee: "Dummy" });

    // Open issue, initiate deletion, cancel, and close details
    cy.contains(
      IssueModal.backlogList,
      "p",
      "This is an issue of type: Task."
    ).click();
    IssueModal.clickDeleteButton();
    IssueModal.cancelDeletion();
    IssueModal.closeDetailModal();

    // Ensure issue still exists
    IssueModal.validateIssueVisibilityState(
      "This is an issue of type: Task.",
      true
    );
  });

  // Test case for successful deletion
  it("Should delete issue successfully", () => {
    // Validate initial issue count
    IssueModal.ensureIssueIsCreated(4, { title: "Dummy", assignee: "Dummy" });

    // Open issue, initiate and confirm deletion
    cy.contains(
      IssueModal.backlogList,
      "p",
      "This is an issue of type: Task."
    ).click();
    IssueModal.clickDeleteButton();
    IssueModal.confirmDeletion();

    // Validate issue no longer exists
    IssueModal.validateIssueVisibilityState(
      "This is an issue of type: Task.",
      false
    );
  });
});
