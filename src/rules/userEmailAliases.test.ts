import { describe, it } from "vitest";
import userEmailAliases from "./userEmailAliases";
import fc from "fast-check";

// The part before the @
const emailUsername = fc.emailAddress().map(email => email.split("@")[0] || "");

describe("userEmailAliases", () => {
  it("returns true if correct alias", () => {
    fc.assert(
      fc.property(emailUsername, (username) => {
        return userEmailAliases.predicate({
          users: [
            {
              emails: [{address: username + "@satakuntatalo.fi"}],
              primaryEmail: username + "@satakuntalainenosakunta.fi",
            },
          ],
        });
      })
    );
  });

  it("returns false if alias does not end in @satakuntatalo.fi ", () => {
    fc.assert(
      fc.property(emailUsername, (username) => {
        return userEmailAliases.predicate({
          users: [
            {
              emails: [{address: username + "@gmail.com"}],
              primaryEmail: username + "@satakuntalainenosakunta.fi",
            },
          ],
        }) === false;
      })
    );
  });

  it("returns false if alias does not have same username", () => {
    fc.assert(
      fc.property(emailUsername, (username) => {
        return userEmailAliases.predicate({
          users: [
            {
              emails: [{address: username + "asd" + "@satakuntatalo.fi"}],
              primaryEmail: username + "@satakuntalainenosakunta.fi",
            },
          ],
        }) === false;
      })
    );
  });
});
