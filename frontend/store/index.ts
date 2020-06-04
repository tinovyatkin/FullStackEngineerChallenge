interface State {
  auth: string | null;
  roles: Set<string>;
}

export const state = (): State => {
  return {
    auth: null,
    roles: new Set(),
  };
};

export const mutations = {
  setAuth(state: State, auth: string) {
    state.auth = auth;
  },

  setRoles(state: State, roles: string[]) {
    for (const role of roles) state.roles.add(role);
  },

  clearRoles(state: State) {
    for (const role of state.roles) state.roles.delete(role);
  },
};

export const actions = {
  async nuxtServerInit({ commit }, { req }) {
    let auth = null;
    let roles = [];
    if (req.headers.cookie) {
      const cookieparser = await import("cookieparser");
      const parsed = cookieparser.parse(req.headers.cookie);
      try {
        auth = JSON.parse(parsed.auth);
        roles = JSON.parse(parsed.roles);
      } catch (err) {
        // No valid cookie found
      }
    }
    commit("setAuth", auth);
    commit("setRoles", roles);
  },
};
