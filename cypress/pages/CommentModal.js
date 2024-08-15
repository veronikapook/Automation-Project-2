class CommentModal {
  constructor() {
    this.commentTextArea = 'textarea[placeholder="Add a comment..."]';
    this.saveCommentButton = 'button:contains("Save")';
    this.editCommentButton = 'button:contains("Edit")';
    this.commentContainer = '[data-testid="issue-comment"]';
    this.deleteCommentButton = 'button:contains("Delete")';
    this.confirmDeleteModal = '[data-testid="modal:confirm"]';
    this.confirmDeleteCommentButton = 'button:contains("Delete comment")';
  }

  addComment(comment) {
    cy.contains("Add a comment...").click();
    cy.get(this.commentTextArea).type(comment);
    cy.get(this.saveCommentButton).click().should("not.exist");
    cy.contains("Add a comment...").should("exist");
  }

  assertCommentExists(comment) {
    cy.get(this.commentContainer).should("contain", comment);
  }

  editComment(oldComment, newComment) {
    cy.get(this.commentContainer)
      .contains(oldComment)
      .closest(this.commentContainer)
      .contains("Edit")
      .click();

    cy.get(this.commentTextArea)
      .should("contain", oldComment)
      .clear()
      .type(newComment);

    cy.get(this.saveCommentButton).click().should("not.exist");
  }

  clickDeleteComment() {
    cy.get(this.commentContainer).contains(this.deleteCommentButton).click();
  }

  confirmDeleteComment() {
    cy.get(this.confirmDeleteModal)
      .should("be.visible")
      .within(() => {
        cy.contains(this.confirmDeleteCommentButton)
          .should("be.visible")
          .click();
      });
    cy.get(this.confirmDeleteModal).should("not.exist");
  }

  assertCommentDoesNotExist() {
    cy.get(this.commentContainer).should("not.exist");
  }
}

export default new CommentModal();
