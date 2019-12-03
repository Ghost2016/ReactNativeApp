export type ApiServerSettings = {
  authentication_methods: AuthenticationMethods,
  email_auth_enabled: boolean,
  msg: string,
  push_notifications_enabled: boolean,
  realm_description: string,
  realm_icon: string,
  realm_name: string,
  realm_uri: string,
  require_email_format_usernames: boolean,
  zulip_version: string
};
