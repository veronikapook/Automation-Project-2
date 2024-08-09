// Constants
const trashButton = '[data-testid="icon:trash"]';
const closeIssueButton = 'button:has([data-testid="icon:close"])';
const confirmationWindow = '[data-testid="modal:confirm"]';
const getIssueDetailsModal = '[data-testid="modal:issue-details"]';
const backLog = '[data-testid="board-list:backlog"]';
const backLogList = '[data-testid="list-issue"]';
const issueTitle = "This is an issue of type: Task.";

// Functions
const checkBacklogIssueCount = (expectedCount) => {
  cy.get(backLog)
    .should("be.visible")
    .and("have.length", 1)
    .within(() => {
      cy.get(backLogList).should("have.length", expectedCount);
    });
};

const openIssue = (issueTitle) => {
  cy.contains(issueTitle).click();
};

const initiateIssueDeletion = () => {
  cy.get(getIssueDetailsModal).within(() => {
    cy.get(trashButton).click();
  });
};

const confirmDeletion = () => {
  cy.get(confirmationWindow).within(() => {
    cy.contains("Delete issue").click();
  });
};

const cancelDeletion = () => {
  cy.get(confirmationWindow).within(() => {
    cy.contains("Cancel").click();
  });
};

const closeIssueDetailsModal = () => {
  cy.get(getIssueDetailsModal).within(() => {
    cy.get(closeIssueButton).last().click();
  });
};

describe("Issue deleting", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
      });
  });

  it("Should cancel deletion process successfully and validate", () => {
    checkBacklogIssueCount(4);

    openIssue(issueTitle);
    initiateIssueDeletion();
    cancelDeletion();
    closeIssueDetailsModal();

    checkBacklogIssueCount(4);
    cy.get(backLog).find("p").contains(issueTitle);
  });

  it("Should delete issue successfully", () => {
    checkBacklogIssueCount(4);

    openIssue(issueTitle);
    initiateIssueDeletion();
    confirmDeletion();

    cy.get(confirmationWindow).should("not.exist");
    checkBacklogIssueCount(3);
  });
});
