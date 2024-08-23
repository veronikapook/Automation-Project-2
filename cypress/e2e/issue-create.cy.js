import IssueModal from "../pages/IssueModal";
import { faker } from "@faker-js/faker";

describe("Issue create", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board?modal-issue-create=true");
      });
  });

  it("Should create Story issue and validate it successfully", () => {
    const issueDetails = {
      type: "Story",
      title: "TEST_TITLE",
      description: "TEST_DESCRIPTION",
      assignee: "Pickle Rick",
    };

    // Create a new issue using the IssueModal page object
    IssueModal.createIssue(issueDetails);

    // Assert the issue was created successfully
    IssueModal.ensureIssueIsCreated(5, issueDetails);

    // Validate the issue visibility
    IssueModal.validateIssueVisibilityState(issueDetails.title);
  });

  it("Should create Bug issue and validate it successfully", () => {
    const issueDetails = {
      type: "Bug",
      title: "Bug",
      description: "My bug description",
      assignee: "Lord Gaben",
      priority: "Highest",
    };

    // Create a new issue using the IssueModal page object
    IssueModal.createIssue(issueDetails);

    // Assert the issue was created successfully
    IssueModal.ensureIssueIsCreated(5, issueDetails);

    // Validate the issue in the backlog
    cy.get('[data-testid="board-list:backlog"]')
      .contains("Bug")
      .within(() => {
        cy.get('[data-testid="avatar:Lord Gaben"]').should("be.visible");
        cy.get('[data-testid="icon:bug"]').should("be.visible");
      });
  });

  it("Should create Task issue using random data and validate it successfully", () => {
    const issueDetails = {
      title: faker.lorem.word(),
      description: faker.lorem.sentence(3),
      assignee: "Baby Yoda",
      priority: "Low",
    };

    // Create the issue
    IssueModal.getIssueModal().within(() => {
      IssueModal.editTitle(issueDetails.title);
      IssueModal.editDescription(issueDetails.description);
      IssueModal.selectAssignee(issueDetails.assignee);
      cy.get(IssueModal.submitButton).click();
    });

    // Wait for any potential loading to complete
    cy.wait(5000);

    // Reload the page to ensure we're seeing the latest state
    cy.reload();

    cy.get('[data-testid="avatar:Lord Gaben"]').should("be.visible");
    cy.get('[data-testid="icon:task"]').should("be.visible");
  });

  it("Should validate title is required field if missing", () => {
    IssueModal.getIssueModal().within(() => {
      cy.get(IssueModal.submitButton).click();
      cy.get(IssueModal.title).should(
        "have.css",
        "border-color",
        "rgb(223, 225, 230)"
      );
    });

     //Sprint 2, BONUS, task 3. Test may need several reruns on Cypress to pass

  it.only("Ensure that the issue title does not have any leading or trailing spaces", () => {
    const randomDescription = faker.lorem.sentence();
    const issueTitleWithExtraSpaces = `   ${faker.word.noun()}   `;

    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get(".ql-editor")
        .type(randomDescription)
        .should("have.text", randomDescription);
      cy.get('input[name="title"]')
        .type(issueTitleWithExtraSpaces)
        .should("have.value", issueTitleWithExtraSpaces);
      cy.get('button[type="submit"]').click();
    });
    const trimmedTitle = issueTitleWithExtraSpaces.trim();

    // Validate that the board have trimmed title
    cy.get('[data-testid="list-issue"]', { timeout: 60000 })
      .first()
      .should("be.visible")
      .and("contain", trimmedTitle)
      .click();
  });
});
