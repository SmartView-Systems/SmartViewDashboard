{application,emqx_auth_mnesia,
             [{description,"EMQX Buitl-in Database Authentication and Authorization"},
              {vsn,"0.1.1"},
              {registered,[]},
              {mod,{emqx_auth_mnesia_app,[]}},
              {applications,[kernel,stdlib,emqx,emqx_auth]},
              {env,[]},
              {modules,[emqx_auth_mnesia_app,emqx_auth_mnesia_sup,
                        emqx_authn_mnesia,emqx_authn_mnesia_schema,
                        emqx_authn_scram_mnesia,
                        emqx_authn_scram_mnesia_schema,emqx_authz_api_mnesia,
                        emqx_authz_mnesia,emqx_authz_mnesia_schema]},
              {licenses,["Apache 2.0"]},
              {links,[]}]}.