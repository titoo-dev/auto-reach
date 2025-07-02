# GitHub Copilot Custom Instructions

## 🧠 Project Context

This project is a multichannel prospecting automation tool that allows users to:

- Send direct messages via **Facebook Messenger** and **Instagram DMs**
- Use **message templates** with variables like `{{firstName}}` or `{{company}}`
- **Tag and segment contacts**
- **Schedule campaigns** with randomized delay to avoid spam detection
- **Sync contacts, messages, and tags with Zoho CRM**
- View messages in a **unified inbox** and manage reply tracking
- Eventually integrate with other CRMs like HubSpot or Pipedrive

The goal is to help freelancers and sales professionals automate and centralize their outreach workflows in a CRM-integrated way.

## 🛡️ Development Guidelines

### Breaking Changes Prevention
- **Always maintain backward compatibility** when modifying existing APIs, database schemas, or component interfaces
- **Use deprecation warnings** before removing features - mark as deprecated for at least one major version
- **Version API endpoints** (e.g., `/api/v1/contacts`) when making breaking changes
- **Preserve existing database columns** - add new columns instead of modifying existing ones
- **Maintain existing component prop interfaces** - add optional props, don't change required ones

### Safe Feature Addition
- **Feature flags** for new functionality to enable gradual rollout
- **Database migrations** should be reversible and tested
- **New components** should not affect existing component behavior
- **Environment variables** should have sensible defaults for backward compatibility
- **New dependencies** should not conflict with existing ones

### Bug Fix Guidelines
- **Preserve existing behavior** unless it's clearly broken
- **Add tests** for the bug scenario before fixing
- **Consider edge cases** that existing users might depend on
- **Document any behavior changes** in changelog
- **Test against existing data** to ensure no data corruption

Always make generated components beautiful following shadcn ui UI Kit.