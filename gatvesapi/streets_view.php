<h1>Tabledump</h1>
<table>
<?php
if (is_array($this->streets)) {
foreach  ($this->streets as $row) {
?>
    <tr>
<?php
    foreach ($row as $key => $value) {
        ?>
        <td><?= $value; ?></td>
        
    <?php }

?>        
    </tr>
<?php
}}

?>
</table>