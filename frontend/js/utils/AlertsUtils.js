/**
* Copyright 2017, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/
function getRegionsCode(selectedRegions) {
    return selectedRegions.map((r) => r.code).join();
}
function getHazards(hazards) {
    return hazards.filter((h) => h.selected).map((h) => h.name).join();
}
function getLevels(levels) {
    return levels.filter((l) => l.selected).map((l) => l.name).join();
}
module.exports = {
    createFilter: (hazards, levels, regions, interval, text) => {
        let filter = `&promoted=false&hazard_type__in=${getHazards(hazards)}&levels__in=${getLevels(levels)}`;
        if (regions && regions.length > 0) {
            filter += `&regions__code__in=${getRegionsCode(regions)}`;
        }
        if (text) {
            filter += `&title__startswith=${text}`;
        }
        if (interval) {
            filter += `&reported_at__gt=${interval}`;
        }
        return filter;
    }
};
