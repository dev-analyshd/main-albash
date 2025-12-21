module.exports=[193695,(a,b,c)=>{b.exports=a.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},70864,a=>{a.n(a.i(233290))},43619,a=>{a.n(a.i(379962))},13718,a=>{a.n(a.i(685523))},118198,a=>{a.n(a.i(545518))},262212,a=>{a.n(a.i(866114))},922882,a=>{a.n(a.i(146927))},419900,a=>{"use strict";let b=(0,a.i(211857).registerClientReference)(function(){throw Error("Attempted to call SwapDashboardContent() from the server but SwapDashboardContent is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/components/swap/swap-dashboard-content.tsx <module evaluation>","SwapDashboardContent");a.s(["SwapDashboardContent",0,b])},482450,a=>{"use strict";let b=(0,a.i(211857).registerClientReference)(function(){throw Error("Attempted to call SwapDashboardContent() from the server but SwapDashboardContent is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/components/swap/swap-dashboard-content.tsx","SwapDashboardContent");a.s(["SwapDashboardContent",0,b])},934178,a=>{"use strict";a.i(419900);var b=a.i(482450);a.n(b)},181004,a=>{"use strict";var b=a.i(907997);a.i(570396);var c=a.i(673727),d=a.i(998310),e=a.i(934178);async function f(){let a=await (0,d.createClient)(),{data:{user:f}}=await a.auth.getUser();f||(0,c.redirect)("/auth/login?redirect=/dashboard/swaps");let[g,h,i]=await Promise.all([a.from("swap_requests").select(`
        *,
        initiator:profiles!swap_requests_initiator_id_fkey(id, full_name, avatar_url, reputation_score, is_verified),
        target_user:profiles!swap_requests_target_user_id_fkey(id, full_name, avatar_url, reputation_score, is_verified),
        target_listing:listings!swap_requests_target_listing_id_fkey(id, title, images, price),
        offering_listing:listings!swap_requests_offering_listing_id_fkey(id, title, images, price)
      `).eq("initiator_id",f.id).order("created_at",{ascending:!1}),a.from("swap_requests").select(`
        *,
        initiator:profiles!swap_requests_initiator_id_fkey(id, full_name, avatar_url, reputation_score, is_verified),
        target_user:profiles!swap_requests_target_user_id_fkey(id, full_name, avatar_url, reputation_score, is_verified),
        target_listing:listings!swap_requests_target_listing_id_fkey(id, title, images, price),
        offering_listing:listings!swap_requests_offering_listing_id_fkey(id, title, images, price)
      `).eq("target_user_id",f.id).order("created_at",{ascending:!1}),a.from("swap_requests").select(`
        *,
        initiator:profiles!swap_requests_initiator_id_fkey(id, full_name, avatar_url, reputation_score, is_verified),
        target_user:profiles!swap_requests_target_user_id_fkey(id, full_name, avatar_url, reputation_score, is_verified),
        target_listing:listings!swap_requests_target_listing_id_fkey(id, title, images, price),
        offering_listing:listings!swap_requests_offering_listing_id_fkey(id, title, images, price)
      `).or(`initiator_id.eq.${f.id},target_user_id.eq.${f.id}`).in("status",["pending","accepted"]).order("created_at",{ascending:!1})]),j=[...g.data||[],...h.data||[]],k=j.filter(a=>"completed"===a.status),l=j.filter(a=>"pending"===a.status);return(0,b.jsx)(e.SwapDashboardContent,{sentSwaps:g.data||[],receivedSwaps:h.data||[],activeSwaps:i.data||[],completedSwaps:k,pendingSwaps:l,userId:f.id})}a.s(["default",()=>f])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__68cc73ab._.js.map