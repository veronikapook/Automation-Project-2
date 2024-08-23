import IssueModal from "../pages/IssueModal";

// Constants
const issueTitle = "This is an issue of type: Task.";
const selectType = '[data-testid="select:type"]';
const selectStatus = '[data-testid="select:status"]';
const selectAssignees = '[data-testid="select:assignees"]';
const selectReporter = '[data-testid="select:reporter"]';
const selectPriority = '[data-testid="select:priority"]';
const priorityMedium = '[data-testid="select-option:Medium"]';
const titleInput = 'textarea[placeholder="Short summary"]';
const descriptionField = ".ql-editor";

// Functions
const getIssueDetailsModal = () => cy.get(IssueModal.issueDetailModal);

describe("Issue details editing", () => {
  beforeEach(() => {
    cy.visit("/board");
    cy.contains(issueTitle).click();
  });

  it("Should update type, status, assignees, reporter, priority successfully", () => {
    getIssueDetailsModal().within(() => {
      cy.get(selectType).click("bottomRight");
      cy.get('[data-testid="select-option:Story"]')
        .trigger("mouseover")
        .trigger("click");
      cy.get(selectType).should("contain", "Story");

      cy.get(selectStatus).click("bottomRight");
      cy.get('[data-testid="select-option:Done"]').click();
      cy.get(selectStatus).should("have.text", "Done");

      cy.get(selectAssignees).click("bottomRight");
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get(selectAssignees).click("bottomRight");
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get(selectAssignees).should("contain", "Baby Yoda");
      cy.get(selectAssignees).should("contain", "Lord Gaben");

      cy.get(selectReporter).click("bottomRight");
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get(selectReporter).should("have.text", "Pickle Rick");

      cy.get(selectPriority).click("bottomRight");
      cy.get(priorityMedium).click();
      cy.get(selectPriority).should("have.text", "Medium");
    });
  });

  it("Should update title, description successfully", () => {
    const title = "TEST_TITLE";
    const description = "TEST_DESCRIPTION";

    getIssueDetailsModal().within(() => {
      cy.get('textarea[placeholder="Short summary"]')
        .clear()
        .type(title)
        .blur();

      cy.get(".ql-snow").click().should("not.exist");

      cy.get(".ql-editor").clear().type(description);

      cy.contains("button", "Save").click().should("not.exist");

      cy.get('textarea[placeholder="Short summary"]').should(
        "have.text",
        title
      );
      cy.get(".ql-snow").should("have.text", description);
    });
  });

  it("Priority dropdown functionality checking", () => {
    const priorityArray = [];
    const expectedLength = 5;

    getIssueDetailsModal().within(() => {
      cy.get(selectPriority).each(($option) => {
        priorityArray.push($option.text());
        cy.log(
          `Added value: ${$option.text()}, Array length: ${
            priorityArray.length
          }`
        );
      });

      cy.get(selectPriority).click();
      cy.get('[data-testid*="select-option:"]')
        .each(($option) => {
          priorityArray.push($option.text());
          cy.log(
            `Added value: ${$option.text()}, Array length: ${
              priorityArray.length
            }`
          );
        })
        .then(() => {
          expect(priorityArray.length).to.equal(expectedLength);
        });
    });
  });

  it("Should validate reporter name with regex", () => {
    const regex = /^[A-Za-z\s]*$/;

    getIssueDetailsModal().within(() => {
      cy.get(selectReporter).invoke("text").should("match", regex);
    });
  });
});
