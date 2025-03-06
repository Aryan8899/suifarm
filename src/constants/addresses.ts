export const CONSTANTS = {
    PACKAGE_ID: "0xc1a0891b7d140ef5f28a02a06ed650d61338ff7ce092af8798f2db901a5528db",
    ROUTER_ID: "0x58440b8f50bc3f1afe98b6b80c427220fc68cbe5c305d2d36c119d0cec5c4a4e",
    FACTORY_ID: "0x3e00945fd2f5517dd5f2d13fe4e734a541633a7182bc22710cf1f56bd2e4894b",
    FARM_ID: "0xd45460ea3754666019c1af84e32bbe2bc7dc392d2ef41ea3e4ac256e4ae0dacf",
    FARM_CONFIG_ID: "0xffd95bcad6881f63e9d89df3a6efc4cce3b493d8ceabf513e8364dedd0c21033",
    ADMIN_CAP_ID: "0x34b4b4937b5770a002fbe355d6bc7b52430b8842e417c443644f93b5efaddc4d",
    PAIR_ADMIN_CAP_ID: "0xc579160709e3e4f1cf07e57e0dc64991fb5230274543675e2082430ead10e4f7",
    UPGRADE_CAP_ID: "0xc537d68acd542d7419fb2bdd8a228271b6cd105e59e41d6adeeb9657e7d32592",
    VICTORY_TOKEN: {
        TYPE: "0xc1a0891b7d140ef5f28a02a06ed650d61338ff7ce092af8798f2db901a5528db::victory_token::VICTORY_TOKEN",
        TREASURY_CAP_WRAPPER_ID: "0xd7ecc3b7d821ddd30c40e667f20c90095d7b23f1195f5580420be1216bf52c0e",
        MINTER_CAP_ID: "0x5172448bec8a2d21963234557f0b1fa8f1fea60b73be956c6575da0050aafb4c",
        METADATA_ID: "0x5c15ca7b3857b6fd599fdddc643e3c6737c86b85f8123608617e1af597e97f0a"
    },
    MODULES: {
        FACTORY: "factory",
        PAIR: "pair",
        ROUTER: "router",
        LIBRARY: "library",
        FIXED_POINT_MATH: "fixed_point_math",
        FARM: "farm",
        FARM_CONFIG: "farm_config",
        VICTORY_TOKEN: "victory_token"
    },
    getPairID: (token0: string, token1: string) => `${token0}_${token1}_pair`
}