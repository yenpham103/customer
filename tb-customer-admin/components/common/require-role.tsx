// import { Spinner } from '@shopify/polaris';
// import { useRouter } from 'next/navigation';
// import { EmptyLayout } from './empty';
// import { useSession } from 'next-auth/react';

// export function RequireRole(requiredRoles = [], requiredPermissions = [], WrappedComponent) {
//     return function WithRequireRole(props) {
//         const router = useRouter();
//         const { data: session, status } = useSession();

//         // if (firstLoading) {
//         //     return <Spinner />;
//         // }

//         if (!session) {
//             router.push('/users/login');
//             return null;
//         }

//         if (requiredRoles.length > 0 && !requiredRoles.includes(session?.user?.role)) {
//             router.push('/');
//             return null;
//         }

//         if (
//             requiredPermissions.length > 0 &&
//             !requiredPermissions.every((permission) => session?.user?.permission.includes(permission))
//         ) {
//             router.push('/');
//             return null;
//         }

//         return <WrappedComponent {...props} />;
//     };
// }

// export const withRoleAndLayout =
//     (roles = [], permissions = [], LayoutComponent) =>
//         (WrappedComponent) => {
//             const WrappedWithRequireRole = RequireRole(roles, permissions, WrappedComponent);

//             return function WithRoleAndLayout(props) {
//                 const Layout = LayoutComponent ?? EmptyLayout;

//                 return (
//                     <Layout>
//                         <WrappedWithRequireRole {...props} />
//                     </Layout>
//                 );
//             };
//         };
