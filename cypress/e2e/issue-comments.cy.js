import IssueModal from "../pages/IssueModal";
import CommentModal from "../pages/CommentModal";

describe("Issue comments creating, editing and deleting", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  it("Should create a comment successfully", () => {
    const comment = "TEST_COMMENT";

    IssueModal.getIssueDetailModal().within(() => {
      CommentModal.addComment(comment);
      CommentModal.assertCommentExists(comment);
    });
  });

  it("Should edit a comment successfully", () => {
    const previousComment = "An old silent pond...";
    const editedComment = "TEST_COMMENT_EDITED";

    IssueModal.getIssueDetailModal().within(() => {
      CommentModal.editComment(previousComment, editedComment);
      CommentModal.assertCommentExists(editedComment);
    });
  });

  it("Should delete a comment successfully", () => {
    const popUpConfirmationWindow = '[data-testid="modal:confirm"]';
    IssueModal.getIssueDetailModal().within(() => {
      cy.get(CommentModal.commentContainer).contains("Delete").click();
    });

    cy.get(popUpConfirmationWindow)
      .should("be.visible")
      .within(() => {
        cy.contains("button", "Delete comment").should("be.visible").click();
      });

    cy.get(popUpConfirmationWindow).should("not.exist");

    IssueModal.getIssueDetailModal().within(() => {
      cy.get(CommentModal.commentContainer).should("not.exist");
    });
  });

  it("Should add, edit, and delete a comment successfully", () => {
    const initialComment = "Initial test comment";
    const editedComment = "Edited test comment";

    // Add a comment
    IssueModal.getIssueDetailModal().within(() => {
      CommentModal.addComment(initialComment);
      CommentModal.assertCommentExists(initialComment);
    });

    // Edit the comment
    IssueModal.getIssueDetailModal().within(() => {
      CommentModal.editComment(initialComment, editedComment);
      CommentModal.assertCommentExists(editedComment);
    });

    cy.get(CommentModal.commentContainer).its("length").then(console.log);

    // Delete the comment
    const popUpConfirmationWindow = '[data-testid="modal:confirm"]';
    IssueModal.getIssueDetailModal().within(() => {
      cy.get(CommentModal.commentContainer)
        .contains(editedComment)
        .closest(CommentModal.commentContainer)
        .contains("Delete")
        .click();
    });

    cy.get(popUpConfirmationWindow)
      .should("be.visible")
      .within(() => {
        cy.contains("button", "Delete comment").should("be.visible").click();
      });

    cy.get(popUpConfirmationWindow).should("not.exist");

    // Assert that the specific comment is removed
    IssueModal.getIssueDetailModal().within(() => {
      cy.contains(editedComment).should("not.exist");

      cy.get(CommentModal.commentContainer).each(($el) => {
        cy.wrap($el).invoke("text").then(console.log);
      });
    });
  });
});
