import React from 'react';

const SeedsGass = (): React.ReactElement => {
  return (
    <>
      <script
        type="text/javascript"
        src="https://gass.seeds.finance/js/aql3px8cpw1740487123178.js"
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
          window.gass && window.gass.run(
            {
              subdomain: 'gass.seeds.finance',
              pkey: '939E98001B6C92B322B0F42C05121F1E',
              interval: 2,
              connector: [
                "2CE5B915F633F2E930AD78558E0EBF2E",
                "D293075AA886E9F0645B9B019DDC2E0D"
              ]
            },
            function(data) {}
          );
        `
        }}
      />
    </>
  );
};

export default SeedsGass;
