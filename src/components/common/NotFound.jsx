import PageHeader from "@/components/common/PageHeader.jsx";

const NotFound = () => {
    return <>
        <PageHeader heading={'401'} subheading={'Page Not Found'} />
        <p>Sorry, but the page you were trying to view does not exist.</p>
    </>;
};

export default NotFound;