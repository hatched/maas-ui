import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import SyslogForm from "./SyslogForm";

const mockStore = configureStore();

describe("SyslogForm", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {
        loading: false,
        loaded: true,
        items: [
          {
            name: "remote_syslog",
            value: ""
          }
        ]
      }
    };
  });

  it("displays a spinner if config is loading", () => {
    const state = { ...initialState };
    state.config.loading = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <SyslogForm />
      </Provider>
    );

    expect(wrapper.find("Loader").exists()).toBe(true);
  });

  it("dispatches an action to update config on save button click", done => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <SyslogForm />
      </Provider>
    );
    wrapper.find("form").simulate("submit");

    // since Formik handler is evaluated asynchronously we have to delay checking the assertion
    window.setTimeout(() => {
      expect(store.getActions()).toEqual([
        {
          type: "UPDATE_CONFIG",
          payload: {
            params: [
              {
                name: "remote_syslog",
                value: ""
              }
            ]
          },
          meta: {
            model: "config",
            method: "update"
          }
        }
      ]);
      done();
    }, 0);
  });

  it("dispatches action to fetch config if not already loaded", () => {
    const state = { ...initialState };
    state.config.loaded = false;
    const store = mockStore(state);

    mount(
      <Provider store={store}>
        <SyslogForm />
      </Provider>
    );

    const fetchActions = store
      .getActions()
      .filter(action => action.type.startsWith("FETCH"));

    expect(fetchActions).toEqual([
      {
        type: "FETCH_CONFIG",
        meta: {
          model: "config",
          method: "list"
        }
      }
    ]);
  });
});
