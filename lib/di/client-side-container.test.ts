import {
  getNotificationService,
  initializeContainer,
} from "./client-side-container";

describe("getNotificationService", () => {
  it("should return an instance", () => {
    initializeContainer();
    const service = getNotificationService();
    expect(service).toBeDefined();
  });
});
