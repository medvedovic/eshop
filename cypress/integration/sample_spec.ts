describe("Navigation", () => {
  it("admin can edit an item", () => {
    cy.visit("/login");
    cy.get("button").click();
    cy.get("a[id=sign-out]").should("be.visible");
    cy.get('a[href="/product/fujara"]').first().click();
    cy.get('a[href="/product/fujara/edit"]').first().click();
    cy.get("input.details__title.details__title--edit").clear();
    cy.get("input.details__title.details__title--edit").type("Fujaraaa");
    cy.get("button[id=submit-changes]").click();
    cy.go("back");
    cy.get("h1.product__title").should("have.text", "Fujaraaa");
    cy.get("a[id=sign-out]").click();
  });
});
