// ------ 1L5F7 ------
// This file is required by Umi.
//
// API config is at 3S6Z8.
// CLI config is at 4T1D2.
// ENV config is at 5C6R9.
// Umi base config is at 8H6M5.
// Umi routes config is at 5X1N3.
// Umi locale config is at 7C2D6.
// Umi proxy config is at 3M1Q2.
// Umi webpack config is at 9I8V5.
// Umi `initialState` make function is at 4U7G9.
// Umi page layout config is at 2X4C7.
// Umi page layout function is at 5S8D7.
// Page header component is at 1Z3A5.
// Page footer component is at 6H8S1.
// Page HTML file is at 9S4Z3.


// -----
import { defineConfig } from 'umi';

// Must use relative path. `@/` will cause import error.
import { UmiConfig } from '../src/config/umi_config';


// -----
const UmiConfigDefined = defineConfig(UmiConfig);


// -----
// Required by Umi.
export default UmiConfigDefined;
