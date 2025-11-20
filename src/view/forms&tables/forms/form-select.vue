<script setup lang="ts">
import PageHeading from '@/components/common/PageHeading.vue';
import pagesMaintenance from '@/view/Pages/pages/pages-maintenance.vue';
import CardComponent from './common-components/CardComponent.vue';

// Set the components prop default to return our fresh components 
const optionList = [
    { label: "Options 1", value: "1" },
    { label: "Options 2", value: "2" },
    { label: "Options 3", value: "3" },
    { label: "Options 4", value: "4" },
    { label: "Options 5", value: "5" },
    { label: "Options 6", value: "6" },
    { label: "Options 7", value: "7" },
    { label: "Options 8", value: "8" },
]

</script>
<template>
    <PageHeading title="Select" sub-title="Forms" />
    <!-- <pagesMaintenance /> -->
    <div class="grid grid-cols-12 gap-x-space">
        <CardComponent :halfWidth="true" title="Default Select">
            <Multiselect :options="optionList" placeholder="Select"></Multiselect>
        </CardComponent>
        <CardComponent :halfWidth="true" title="With search box">
            <Multiselect :options="optionList" placeholder="Select"></Multiselect>
        </CardComponent>
        <CardComponent :halfWidth="true" title="Multiple Select">
            <Multiselect :options="optionList" placeholder="Select" multiple></Multiselect>
        </CardComponent>
        <CardComponent :halfWidth="true" title="Multiple Select without Search">
            <Multiselect :options="optionList" placeholder="Select" multiple :searchable="true"></Multiselect>
        </CardComponent>
        <CardComponent :halfWidth="true" title="Disabled options">
            <Multiselect :options="optionList" placeholder="Select"></Multiselect>
        </CardComponent>
    </div>
</template>